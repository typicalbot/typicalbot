const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;

const url = require("url");
const path = require("path");
const bodyParser = require("body-parser");

const Discord = require("discord.js");
const Perms = Discord.Permissions;

const page = file => path.resolve(`${__dirname}${path.sep}pages${path.sep}${file}`);

const botOAuth = (client, guild) => `https://discordapp.com/oauth2/authorize?client_id=${client}&permissions=8&scope=bot&redirect_uri=http://dev.typicalbot.com/&response_type=code&guild_id=${guild}`;

class Webserver extends express {
    constructor(master, config) {
        super();

        passport.serializeUser((user, done) => { done(null, user); });
        passport.deserializeUser((obj, done) => { done(null, obj); });

        passport.use(
            new Strategy({
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL: config.redirectUri,
                scope: ["identify", "guilds"]
            }, (accessToken, refreshToken, profile, done) => {
                process.nextTick(() => done(null, profile));
            })
        );

        this.use(session({
            secret: "typicalbot",
            resave: false,
            saveUninitialized: false
        }));
        this.use(passport.initialize());
        this.use(passport.session());
        this.use(bodyParser.json());

        this.engine("html", require("ejs").renderFile);
        this.set("view engine", "html");

        /*
                                                           - - - - - - - - - -

                                                                API

                                                           - - - - - - - - - -
        */

        const isApplication = (req, res, next) => {
            if (req.headers.authorization && req.headers.authorization === "HyperCoder#2975") return next();
            res.status(401).json({ "message": "Unauthorized" });
        };

        /*
                                                           - - - - - - - - - -

                                                                AUTHENTICATION

                                                           - - - - - - - - - -
        */

        this.get("/auth/login", (req, res, next) => {
            if (req.session.backURL) {
                req.session.backURL = req.session.backURL;
            } else if (req.headers.referer) {
                const parsed = url.parse(req.headers.referer);
                if (parsed.hostname === this.locals.domain) {
                    req.session.backURL = parsed.path;
                }
            } else {
                req.session.backURL = '/';
            }
            next();
        }, passport.authenticate("discord"));

        this.get("/auth/callback", passport.authenticate("discord", {
            failureRedirect: `/failed`
        }), (req, res) => {
            if (req.session.backURL) {
                res.redirect(req.session.backURL);
                req.session.backURL = null;
            } else {
                res.redirect("/");
            }
        });

        this.get("/auth/logout", function(req, res) {
            req.logout();
            res.redirect("/");
        });

        /*
                                                           - - - - - - - - - -

                                                                DASHBOARD

                                                           - - - - - - - - - -
        */

        const isAuthenticated = (req, res, next) => { if (req.isAuthenticated()) return next(); req.session.backURL = req.url; res.redirect("/auth/login"); };
        const isStaff = (req, res, next) => { if (req.isAuthenticated() && master.userLevel(req.user.id) >= 6) return next(); req.session.backURL = req.originalURL; res.redirect("/"); };

        let userGuilds = user => {
            return new Promise((resolve, reject) => {
                if (!user.guilds.length) return resolve({ in: [], not: [] });

                let isin = [], notin = [];

                user.guilds.forEach((g, i) => {
                    master.globalRequest("inguild", { guild: g.id }).then(() => {
                        master.globalRequest("userlevel", { guild: g.id, user: user.id }).then(data => {
                            data.permissions.level >= 2 ? isin.push(g) : null;

                            if (i + 1 === user.guilds.length) return resolve({ in: isin, not: notin });
                        }).catch(() => {
                            return reject("An error occured.");
                        });
                    }).catch(() => {
                        new Perms(g.permissions).has("MANAGE_GUILD") ? notin.push(g) : null;

                        if (i + 1 === user.guilds.length) return resolve({ in: isin, not: notin });
                    });
                });
            });
        };

        this.get("/", (req, res) => {
            if (!req.isAuthenticated()) return res.render(page("index.ejs"), {
                master,
                auth: req.isAuthenticated()
            });

            userGuilds(req.user).then(guilds => {
                res.render(page("index.ejs"), {
                    master,
                    guilds: guilds,
                    user: req.user,
                    auth: req.isAuthenticated()
                });
            }).catch(err => {
                console.log(err);
                res.status(500).send("An error occured.");
            });
        });

        this.get("/user", isAuthenticated, (req, res) => {
            res.render(page("user.ejs"), {
                master,
                user: req.user,
                auth: true
            });
        });

        this.get("/staff", isStaff, (req, res) => {
            if (req.query.guildid) return res.redirect(`/guild/${req.query.guildid}`);

            res.render(page("staff.ejs"), {
                master,
                user: req.user,
                auth: true
            });
        });

        this.get("/guild/:guild", isAuthenticated, async (req, res) => {
            let guild = req.params.guild;

            let userInGuild = req.user.guilds.filter(g => g.id === guild)[0];
            if (!userInGuild && master.userLevel(req.user.id) < 6) return res.status(401).json({ "message": "You do not have access to that guild." });

            master.globalRequest("inguild", { guild }).then(() => {
                master.globalRequest("userlevel", { guild, user: req.user.id }).then(data => {
                    if (data.permissions.level < 2) return res.status(401).json({ "message": "You do not have access to the requested guild." });

                    master.globalRequest("guildinfo", { guild }).then(data => {
                        res.render(page("guild.ejs"), {
                            master,
                            guild: data.guild,
                            user: req.user,
                            auth: true
                        });
                    }).catch(() => {
                        res.status(500).json({ "message": "An error occured." });
                    });
                }).catch(() => {
                    res.status(500).json({ "message": "An error occured." });
                });
            }).catch(() => {
                if (!userInGuild) return res.redirect("/");

                let userPerms = new Perms(userInGuild.permissions);
                if (!userPerms.has("MANAGE_GUILD")) return res.status(401).json({ "message": "You do not have permissions to add the bot to that guild." });

                res.redirect(botOAuth(config.client, guild));
            });
        });

        this.use(express.static(`${__dirname}/static`));
        this.use((req, res) => { res.status(404).sendFile(path.join(__dirname, "404.html")); });
        this.listen(3000, () => console.log("Listening to port 3000."));
    }
}

module.exports = Webserver;
