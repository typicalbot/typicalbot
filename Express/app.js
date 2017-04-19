const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const url = require("url");
const path = require("path");
const bodyParser = require("body-parser");

const staticRoot = __dirname;

function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();

    req.session.backURL = req.url;
    res.redirect("/auth/login");
}

function isStaff(req, res, next) {
    if (req.isAuthenticated() && req.user.id === "105408136285818880") return next();

    req.session.backURL = req.url;
    res.redirect("/auth/login");
}

function isApp(req, res, next) {
    if (req.headers.authorization && req.headers.authorization === "HyperCoder#2975") return next();
    res.status(401).json({ "message": "Unauthorized" });
}

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

        this.use(passport.initialize());
        this.use(passport.session());
        this.use(bodyParser.json());
        this.use(express.static(`${staticRoot}/static`));
        this.use(session({ secret: "typicalbotdashboard", resave: false, saveUninitialized: false, }));

        this.engine("html", require("ejs").renderFile);

        this.set("view engine", "html");

        this.locals.domain = "testing.typicalbot.com";

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

        /*
                                                           - - - - - - - - - -

                                                                DASHBOARD

                                                           - - - - - - - - - -
        */

        this.get("/dashboard/admin", isStaff, (req, res) => {
            res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}admin.ejs`), {
                user: req.user,
                auth: true
            });
        });

        this.get("/dashboard", isAuth, (req, res) => {
            res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}dashboard.ejs`), {
                user: req.user,
                auth: true
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
        //    send(req.user, channel, content);

            res.render(path.resolve(`${staticRoot}${path.sep}pages${path.sep}admin.ejs`), {
                user: req.user,
                auth: true
            });
        });

        this.use((req, res) => { res.status(404).sendFile(path.join(__dirname, "404.html")); });
        this.listen(3000, () => console.log("Listening to port 3000."));
    }
}

module.exports = Webserver;
