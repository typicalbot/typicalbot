const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const url = require("url");
const path = require("path");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const Perms = Discord.Permissions;

const staticRoot = __dirname;

let botOAuth = (clientid, guildid) => `https://discordapp.com/oauth2/authorize?client_id=${clientid}&permissions=8&scope=bot&redirect_uri=http://dev.typicalbot.com/&response_type=code&guild_id=${guildid}`;

class Webserver extends express {
    constructor(master, config) {
        super();

        passport.serializeUser((user, done) => { done(null, user); });
        passport.deserializeUser((obj, done) => { done(null, obj); });

        passport.use(new Strategy({
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: config.redirectUri,
            scope: ["identify", "guilds"]
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }));

        this.use(session({ secret: "typicalbot", resave: false, saveUninitialized: false, }));
        this.use(passport.initialize());
        this.use(passport.session());
        this.use(bodyParser.json());

        this.engine("html", require("ejs").renderFile);

        this.set("view engine", "html");

        this.locals.domain = "dev.typicalbot.com";

        function isAuth(req, res, next) {
            if (req.isAuthenticated()) return next();

            req.session.backURL = req.url;
            res.redirect("/auth/login");
        }

        function isStaff(req, res, next) {
            if (req.isAuthenticated() && master.userLevel(req.user.id) >= 6) return next();

            req.session.backURL = req.originalURL;
            res.redirect("/");
        }

        function isApp(req, res, next) {
            if (req.headers.authorization && req.headers.authorization === "HyperCoder#2975") return next();
            res.status(401).json({ "message": "Unauthorized" });
        }

        /*
                                                           - - - - - - - - - -

                                                                AUTHENTICATION

                                                           - - - - - - - - - -
        */

        this.get("/auth", (req, res, next) => {
            res.json({ "logged_in": req.isAuthenticated() });
        });

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

        this.get("/auth/user", isAuth, (req, res) => {
            res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}user.ejs`), {
                master,
                user: req.user,
                auth: true
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                DASHBOARD

                                                           - - - - - - - - - -
        */

        function userGuildsList(user) {
            return new Promise((resolve, reject) => {
                let isin = [], notin = [];
                if (!user.guilds.length) return resolve({ in: [], not: [] });

                user.guilds.forEach((g, i) => {
                    master.inGuild(g.id).then(value => {
                        let userPerms = new Perms(g.permissions);
                        value.in ? isin.push(g) : userPerms.has("MANAGE_GUILD") ? notin.push(g) : null;
                        if (i + 1 === user.guilds.length) return resolve({ in: isin, not: notin });
                    }).catch(reject);
                });
            });
        }

        function userGuilds2(user) {
            return new Promise((resolve, reject) => {
                userGuildsList(user).then(guilds => {
                    let l = guilds.in;
                    if (!l.length) return resolve({ in: [], not: guilds.notin });

                    let hasperm = [];
                    l.forEach((g, i) => {
                        master.guildUserLevel(g.id, user.id).then(data => {
                            if (data.permissions.level >= 2) hasperm.push(g);
                            if (i + 1 === l.length) return resolve({ in: hasperm, not: guilds.not });
                        }).catch(reject);
                    });
                }).catch(reject);
            });
        }

        this.get("/", (req, res) => {
            if (!req.isAuthenticated()) return res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}index.ejs`), { master, auth: false });

            userGuilds(req.user).then(guilds => {
                res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}index.ejs`), {
                    master,
                    guilds: guilds,
                    user: req.user,
                    auth: true
                });
            }).catch(err => {
                console.log(err);
                res.status(500).send("Internal Error");
            });
        });

        this.get("/staff", isStaff, (req, res) => {
            if (req.query.guildid) return res.redirect(`/guild/${req.query.guildid}`);

            res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}staff.ejs`), {
                master,
                user: req.user,
                auth: true
            });
        });

        this.get("/guild/:guildid", isAuth, async (req, res) => {
            let guildid = req.params.guildid;

            master.inGuild(guildid).then(inguild => {
                let userInGuild = req.user.guilds.filter(g => g.id === guildid)[0];
                if (!userInGuild && master.userLevel(req.user.id) < 6) return res.status(401).json({ "message": "You do not have access to that guild." });

                if (inguild.in) {
                    master.guildUserLevel(guildid, req.user.id).then(data => {
                        if (data.permissions.level < 2) return res.status(401).json({ "message": "You do not have access to that guild." });

                        master.guildInformation(guildid).then(data => {
                            res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}guild.ejs`), {
                                master,
                                guild: data.info,
                                user: req.user,
                                auth: true
                            });
                        }).catch(() => {
                            res.status(500).json({ "message": "An error occured." });
                        });
                    }).catch(() => {
                        res.status(500).json({ "message": "An error occured." });
                    });
                } else {
                    if (!userInGuild) return res.redirect("/");

                    let userPerms = new Perms(userInGuild.permissions);
                    if (!userPerms.has("MANAGE_GUILD")) return res.status(401).json({ "message": "You do not have permissions to add the bot to that guild." });
                    res.redirect(botOAuth(config.client, guildid));
                }
            }).catch(() => {
                res.status(500).json({ "message": "An error occured." });
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                API

                                                           - - - - - - - - - -
        */

        this.get("/api/bots/:bot/stats", isApp, (req, res) => {
            let bot = req.params.bot;

            if (bot !== "dev") return res.status(400).json({ message: "Unable to fetch requested stats" });

            let data = {};
            master.shards.forEach(shard => {
                Object.keys(shard.stats).forEach(key => {
                    data[key] ? data[key] += shard.stats[key] : data[key] = shard.stats[key];
                });
            });

            res.status(200).json({ "guilds": data.guilds });
        });

        this.post("/api/channels/:channel/messages", isApp, (req, res) => {
            let channel = req.params.channel;
            let content = req.body.content;

            console.log(channel, content);

            if (!content) return res.status(400).json({ "message": "Missing Message Content" });

            master.transmit("channelmessage", { channel, content });
            res.status(200).json({ "message": "OKAY" });
        });

        this.all("/api*", (req, res) => {
            res.status(401).json({ "message": "Unknown Endpoint or Invalid Method" });
        });

        this.get("/message/:channel/:message", isStaff, (req, res) => {
            let channel = req.params.channel;
            let content = req.params.message;

            res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}admin.ejs`), {
                user: req.user,
                auth: true
            });
        });

        this.use(express.static(`${staticRoot}/static`));
        this.use((req, res) => { res.status(404).sendFile(path.join(__dirname, "404.html")); });
        this.listen(3000, () => console.log("Listening to port 3000."));
    }
}

module.exports = Webserver;
