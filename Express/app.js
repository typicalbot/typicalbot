const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-discord");
const bodyParser = require("body-parser");

const request = require("superagent");
const url = require("url");
const path = require("path");

const { Permissions, Collection } = require("discord.js");

function page(dir, file) { return path.join(__dirname, "base", "pages", dir, file); }
function OAuth(client, guild) { return `https://discordapp.com/oauth2/authorize?client_id=${client}&permissions=8&scope=bot&redirect_uri=http://dev.typicalbot.com:3000/&response_type=code&guild_id=${guild}`; }

const User = require("./Utility/DashboardUser");

module.exports = class extends express {
    constructor(master) {
        super();

        this.config = require("./config");
        this.database = require("rethinkdbdash")(this.config.rethinkdb);

        this.users = new Collection();

        passport.serializeUser((id, done) => { done(null, id); });
        passport.deserializeUser((id, done) => { done(null, this.users.get(id)); });

        passport.use(
            new Strategy({ clientID: this.config.clientID, clientSecret: this.config.clientSecret, callbackURL: this.config.redirectUri, scope: ["identify", "guilds"] },
            (accessToken, refreshToken, profile, done) => {
                this.users.set(profile.id, new User(profile));
                process.nextTick(() => done(null, profile.id));
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

        function isAuthenticated(req, res, next) {
            if (req.isAuthenticated()) return next();
            req.session.backURL = req.url;
            res.redirect("/auth/login");
        }

        function isStaff(req, res, next) {
            if (req.isAuthenticated() && master.staff(req.user.id)) return next();
            req.session.backURL = req.url;
            res.redirect("/");
        }

        function isApplication (req, res, next) {
            if (req.headers.authorization && req.headers.authorization === "HyperCoder#2975") return next();
            res.status(401).json({ "message": "Unauthorized" });
        }

        const rgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return {
                R: parseInt(result[1], 16),
                G: parseInt(result[2], 16),
                B: parseInt(result[3], 16)
            };
        };

        const timestamp = (ms) => {
            const days = ms / 86400000;
            const d = Math.floor(days);
            const hours = (days - d) * 24;
            const h = Math.floor(hours);
            const minutes = (hours - h) * 60;
            const m = Math.floor(minutes);
            const seconds = (minutes - m) * 60;
            const s = Math.floor(seconds);
            return { d, h, m, s };
        };

        const time = (ms) => {
            const ts = timestamp(ms);

            const d = ts.d > 0 ? ts.d === 1 ? "1 day" : `${ts.d} days` : null;
            const h = ts.h > 0 ? ts.h === 1 ? "1 hour" : `${ts.h} hours` : null;
            const m = ts.m > 0 ? ts.m === 1 ? "1 minute" : `${ts.m} minutes` : null;
            const s = ts.s > 0 ? ts.s === 1 ? "1 second" : `${ts.s} seconds` : null;
            const l = [];
            if (d) l.push(d); if (h) l.push(h); if (m) l.push(m); if (s) l.push(s);
            return l.join(", ");
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
            failureRedirect: `/access-denied`
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
            res.render(page("main", "403.ejs"), {
                user: req.user || null,
                auth: req.isAuthenticated()
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                API

                                                           - - - - - - - - - -
        */

        this.get("/api/bots/:bot/stats", /*isApplication, */(req, res) => {
            const bot = req.params.bot;

            if (bot !== "dev") return res.status(400).json({ message: "Unable to fetch requested stats" });

            const data = {};
            master.shards.forEach(shard => {
                Object.keys(shard.stats).forEach(key => {
                    data[key] ? data[key] += shard.stats[key] : data[key] = shard.stats[key];
                });
            });

            res.status(200).json({ "guilds": data.guilds });
        });

        this.all("/api*", (req, res) => {
            res.status(401).json({ "message": "Unknown Endpoint or Invalid Method" });
        });

        /*
                                                           - - - - - - - - - -

                                                                MAIN PAGES

                                                           - - - - - - - - - -
        */

        this.get("/", (req, res) => {
            res.render(page("main", "index.ejs"), {
                master,
                user: req.user,
                auth: req.isAuthenticated()
            });
        });

        this.get("/documentation", (req, res) => {
            res.render(page("main", "documentation.ejs"), {
                master,
                user: req.user,
                auth: req.isAuthenticated()
            });
        });

        this.get("/contact-us", (req, res) => {
            res.render(page("main", "contact-us.ejs"), {
                master,
                user: req.user,
                auth: req.isAuthenticated()
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                APPLICATIONS PAGES

                                                           - - - - - - - - - -
        */

        this.get("/applications", (req, res) => {
            res.render(page("applications", "index.ejs"), {
                master,
                user: req.user,
                auth: req.isAuthenticated()
            });
        });

        this.get("/applications/beta-tester", isAuthenticated, (req, res) => {
            res.render(page("applications", "beta-tester.ejs"), {
                master,
                user: req.user,
                auth: req.isAuthenticated()
            });
        });

        const sendData = (user, tag, why) => {
            request
                .post(`https://discordapp.com/api/channels/334000451643244564/messages`)
                .set("Authorization", `Bot ${this.config.botToken}`)
                .set("Content-Type", "application/json")
                .send({ "content": `**${user.username}#${user.discriminator}** (${user.id}) | Tag: “${tag}” | Reason: “${why}”` })
                .end((err, res) => { if (err) console.error(err); });
        };

        this.get("/applications/beta-tester/form", isAuthenticated, (req, res) => {
            const inGuild = req.user.guilds.map(g => g.id ).includes("163038706117115906");
            if (!inGuild) return res.status(401).json({ "message": "You are not in TypicalBot Lounge." });

            const tag = req.query.tag, why = req.query.why;
            if (!tag || !why) return res.status(401).json({ "message": "Invalid query options." });

            sendData(req.user, tag, why);
            res.redirect("/");
        });

        this.get("/applications/partner", isAuthenticated, (req, res) => {
            res.render(page("applications", "partner.ejs"), {
                master,
                user: req.user,
                auth: req.isAuthenticated()
            });
        });

        this.get("/applications/staff", isAuthenticated, (req, res) => {
            res.render(page("applications", "staff.ejs"), {
                master,
                user: req.user,
                auth: req.isAuthenticated()
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                APPLICATIONS PAGES

                                                           - - - - - - - - - -
        */

        function fetchUserData(user) {
            return new Promise((resolve, reject) => {
                const guilds = user.guilds;
                const guildData = [];

                guilds.forEach((g, i) => {
                    master.globalRequest("dashrequest", { guild: g.id, user: user.id }).then(data => {
                        g.inGuild = data.inGuild; g.permLevel = data.permissions || null;
                        if (data.inGuild && data.permissions.level >= 2) guildData.push(g);
                        if (!data.inGuild && new Permissions(g.permissions).has("MANAGE_GUILD")) guildData.push(g);

                        if (i + 1 === user.guilds.length) setTimeout(() => {
                            resolve(guildData);
                        }, 100);
                    }).catch(err => {
                        console.error(err);
                        if (i + 1 === user.guilds.length) return resolve(guildData);
                    });
                });
            });
        }

        this.get("/dashboard", async (req, res) => {
            if (!req.isAuthenticated()) return res.render(page("dashboard", "index.ejs"), { master, user: req.user, auth: req.isAuthenticated() });

            //const userData = master.donorData.includes(req.user.id) || master.staff(req.user.id) ? await this.database.table("users").get(req.user.id) : null;

            fetchUserData(req.user).then(guilds => {
                res.render(page("dashboard", "index.ejs"), {
                    master,
                    guilds,
                    //theme: userData ? userData.theme : "blue",
                    user: req.user,
                    auth: req.isAuthenticated()
                });
            }).catch(err => {
                console.error(err);
                res.status(500).send("An error occured.");
            });
        });

        this.get("/dashboard/guild/:guild", isAuthenticated, async (req, res) => {
            const guild = req.params.guild;

            const userInGuild = req.user.guilds.filter(g => g.id === guild)[0];
            if (!userInGuild && !master.staff(req.user.id)) return res.redirect("/access-denied");

            master.globalRequest("inguild", { guild }).then(() => {
                master.globalRequest("userlevel", { guild, user: req.user.id }).then(data => {
                    if (data.permissions.level < 2) return res.redirect("/access-denied");

                    master.globalRequest("guildinfo", { guild }).then(data => {
                        res.render(page("dashboard", "guild.ejs"), {
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

                const userPerms = new Permissions(userInGuild.permissions);
                if (!userPerms.has("MANAGE_GUILD")) return res.status(403).json({ "message": "You do not have permissions to add the bot to that guild." });

                res.redirect(OAuth(this.config.clientID, guild));
            });
        });

        this.get("/dashboard/guild/:guild/leave", isAuthenticated, async (req, res) => {
            const guild = req.params.guild;

            const userInGuild = req.user.guilds.filter(g => g.id === guild)[0];
            if (!userInGuild && master.userLevel(req.user.id) < 6) return res.status(401).json({ "message": "You do not have access to that guild." });

            master.globalRequest("inguild", { guild }).then(() => {
                master.globalRequest("userlevel", { guild, user: req.user.id }).then(data => {
                    if (data.permissions.level < 2) return res.status(403).json({ "message": "You do not have access to the requested guild." });

                    master.globalRequest("leaveguild", { guild });
                    res.redirect("/");
                }).catch(() => {
                    res.status(500).json({ "message": "An error occured." });
                });
            }).catch(() => {
                if (!userInGuild) return res.redirect("/");

                const userPerms = new Permissions(userInGuild.permissions);
                if (!userPerms.has("MANAGE_GUILD")) return res.status(403).json({ "message": "You do not have permissions to add the bot to that guild." });

                res.redirect(OAuth(this.config.clientID, guild));
            });
        });

        this.get("/dashboard/staff", isStaff, (req, res) => {
            if (req.query.guildid) return res.redirect(`/dashboard/guild/${req.query.guildid}`);

            master.globalRequest("staffposition", { user: req.user.id }).then(data => {
                res.render(page("dashboard", "staff.ejs"), {
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

        /*
                                                           - - - - - - - - - -

                                                                INIT EXPRESS

                                                           - - - - - - - - - -
        */

        this.use(express.static(`${__dirname}/base/static`));
        this.use((req, res) => {
            res.status(404).render(page("main", "404.ejs"), { master, user: req.user, auth: req.isAuthenticated() });
        });
        this.listen(this.config.port, () => console.log(`Express Server Created | Listening on Port :${this.config.port}`));
    }
};
