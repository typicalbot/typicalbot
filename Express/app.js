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

const botOAuth = (client, guild) => `https://discordapp.com/oauth2/authorize?client_id=${client}&permissions=8&scope=bot&redirect_uri=http://dev.typicalbot.com:3000/&response_type=code&guild_id=${guild}`;

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

        const isAuthenticated = (req, res, next) => { if (req.isAuthenticated()) return next(); req.session.backURL = req.url; res.redirect("/auth/login"); };
        const isStaff = (req, res, next) => { if (req.isAuthenticated() && master.staff(req.user.id)) return next(); req.session.backURL = req.url/*originalURL*/; res.redirect("/"); };
        const isApplication = (req, res, next) => { if (req.headers.authorization && req.headers.authorization === "HyperCoder#2975") return next(); res.status(401).json({ "message": "Unauthorized" }); };

        const rgb = (hex) => {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return {
                R: parseInt(result[1], 16),
                G: parseInt(result[2], 16),
                B: parseInt(result[3], 16)
            };
        };

        const timestamp = (ms) => {
            let days = ms / 86400000;
            let d = Math.floor(days);
            let hours = (days - d) * 24;
            let h = Math.floor(hours);
            let minutes = (hours - h) * 60;
            let m = Math.floor(minutes);
            let seconds = (minutes - m) * 60;
            let s = Math.floor(seconds);
            return { d, h, m, s };
        };

        const time = (ms) => {
            let ts = timestamp(ms);

            let d = ts.d > 0 ? ts.d === 1 ? "1 day" : `${ts.d} days` : null;
            let h = ts.h > 0 ? ts.h === 1 ? "1 hour" : `${ts.h} hours` : null;
            let m = ts.m > 0 ? ts.m === 1 ? "1 minute" : `${ts.m} minutes` : null;
            let s = ts.s > 0 ? ts.s === 1 ? "1 second" : `${ts.s} seconds` : null;
            let l = [];
            if (d) l.push(d); if (h) l.push(h); if (m) l.push(m); if (s) l.push(s);
            return l.join(", ");
        };

        /*
                                                           - - - - - - - - - -

                                                                API

                                                           - - - - - - - - - -
        */

        this.get("/api/bots/:bot/stats", isApplication, (req, res) => {
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

        this.post("/api/channels/:channel/messages", isApplication, (req, res) => {
            let channel = req.params.channel;
            let content = req.body.content;

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

            res.render(page("admin.ejs"), {
                user: req.user,
                auth: true
            });
        });

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
            console.log(`${req.user.username} signed in.`);

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

        this.get("/access-denied", (req, res) => {
            res.render(page("403.ejs"), {
                master,
                user: req.user || null,
                auth: req.isAuthenticated()
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                DASHBOARD

                                                           - - - - - - - - - -
        */

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

        this.get("/beta-apply", isAuthenticated, (req, res) => {
            let inGuild = !!req.user.guilds.filter(g => g.id = "163038706117115906")[0];
            if (!inGuild) return res.status(401).json({ "message": "You are not in TypicalBot Lounge." });

            res.render(page("beta-apply.ejs"), {
                master,
                user: req.user,
                auth: true
            });
        });

        this.get("/beta-apply/form", isAuthenticated, (req, res) => {
            let inGuild = !!req.user.guilds.filter(g => g.id = "163038706117115906")[0];
            if (!inGuild) return res.status(401).json({ "message": "You are not in TypicalBot Lounge." });

            let username = req.query.username;
            let why = req.query.why;
            if (!username || !why) return res.status(401).json({ "message": "Invalid query options." });

            master.transmit("channelmessage", { "channel": "308348915420364810", "content": `${req.user.username}#${req.user.discriminator} | **Stated Username:** ${username} | **Reason:** ${why}\n\n\u200B` });
            res.redirect("/");
        });

        this.get("/staff", isStaff, (req, res) => {
            if (req.query.guildid) return res.redirect(`/guild/${req.query.guildid}`);

            master.globalRequest("userpos", { user: req.user.id }).then(data => {
                res.render(page("staff.ejs"), {
                    master,
                    user: req.user,
                    auth: true,
                    roles: data.roles,
                    rgb,
                    time
                });
            }).catch(() => {
                return res.status(400).json({ "message": "An error occured." });
            });
        });

        this.get("/guild/:guild", isAuthenticated, async (req, res) => {
            let guild = req.params.guild;

            let userInGuild = req.user.guilds.filter(g => g.id === guild)[0];
            if (!userInGuild && !master.staff(req.user.id)) return res.redirect("/access-denied");

            master.globalRequest("inguild", { guild }).then(() => {
                master.globalRequest("userlevel", { guild, user: req.user.id }).then(data => {
                    if (data.permissions.level < 2) return res.redirect("/access-denied");

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
                if (!userInGuild) return res.redirect("/404");

                let userPerms = new Perms(userInGuild.permissions);
                if (!userPerms.has("MANAGE_GUILD")) return res.status(401).json({ "message": "You do not have permissions to add the bot to that guild." });

                res.redirect(botOAuth(config.clientID, guild));
            });
        });

        this.get("/guild/:guild/leave", isAuthenticated, async (req, res) => {
            let guild = req.params.guild;

            let userInGuild = req.user.guilds.filter(g => g.id === guild)[0];
            if (!userInGuild && master.userLevel(req.user.id) < 6) return res.status(401).json({ "message": "You do not have access to that guild." });

            master.globalRequest("inguild", { guild }).then(() => {
                master.globalRequest("userlevel", { guild, user: req.user.id }).then(data => {
                    if (data.permissions.level < 2) return res.status(401).json({ "message": "You do not have access to the requested guild." });

                    master.globalRequest("leaveguild", { guild });
                    res.redirect("/");
                }).catch(() => {
                    res.status(500).json({ "message": "An error occured." });
                });
            }).catch(() => {
                if (!userInGuild) return res.redirect("/");

                let userPerms = new Perms(userInGuild.permissions);
                if (!userPerms.has("MANAGE_GUILD")) return res.status(401).json({ "message": "You do not have permissions to add the bot to that guild." });

                res.redirect(botOAuth(config.clientID, guild));
            });
        });

        this.use(express.static(`${__dirname}/static`));
        this.use((req, res) => {
            if (!req.isAuthenticated()) return res.status(404).render(page("404.ejs"), { master, auth: req.isAuthenticated() });
            res.status(404).render(page("404.ejs"), { master, user: req.user, auth: req.isAuthenticated() });
        });
        this.listen(3000, () => console.log("Listening to port 3000."));
    }
}

module.exports = Webserver;
