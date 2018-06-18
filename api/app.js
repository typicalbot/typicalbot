const express = require("express");
const bodyParser = require("body-parser");
const build = require("../config").build;

const port = build === "stable" ? 5000 : build === "beta" ? 5001 : build === "development" ? 5002 : 5000;

class IPC extends express {
    constructor(handler) {
        super();

        this.handler = handler;

        this.use(bodyParser.json());

        function isAuthenticated(req, res, next) {
            if (req.get("Authorization") && req.get("Authorization").replace("'", "") === this.handler.config.apis.localhost) return next();
            return res.status(403).json({ "message": "Authorization Required" });
        }

        /*
                                                           - - - - - - - - - -

                                                                ENDPOINTS

                                                           - - - - - - - - - -
        */

        this.get("/stats", isAuthenticated.bind(this), (req, res, next) => {
            res.json(handler.stats);
        });

        this.get("/guilds/:guildid", isAuthenticated.bind(this), (req, res, next) => {
            const guild = req.params.guildid;

            this.handler.globalRequest("guildData", { guild }).then(data => {
                return res.status(200).json(data);
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err });
            });
        });

        this.post("/guilds/:guildid/leave", isAuthenticated.bind(this), (req, res, next) => {
            const guild = req.params.guildid;

            this.handler.globalRequest("leaveGuild", { guild }).then(data => {
                return res.status(200).json({ "message": "Success" });
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err });
            });
        });

        this.get("/guilds/:guildid/users/:userid", isAuthenticated.bind(this), (req, res, next) => {
            const guild = req.params.guildid;
            const user = req.params.userid;

            this.handler.globalRequest("userData", { guild, user }).then(data => {
                if (data.permissions.level < 2) return res.redirect("/access-denied");

                return res.status(200).json(data);
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err });
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                WEBHOOK STUFF

                                                           - - - - - - - - - -
        */
        const snekfetch = require("snekfetch");

        this.all("/webhook", async (req, res, next) => {
            console.log(req.headers, req.method);

            const { body } = await snekfetch.post("https://hastebin.com/documents").send(require("util").inspect(req, { depth: 3 })).catch(e => { throw e; });

            console.log(`https://hastebin.com/${body.key}`);

            console.log(req.query["hub.challenge"]);

            res.send(req.query["hub.challenge"]);
        });

        this.get("/webhook/twitch", async (req, res, next) => {
            if (req.query["hub.challenge"]) return res.send(req.query["hub.challenge"]);
            res.send("UNKNOWN REQUEST");
        });

        this.post("/webhook/twitch", async (req, res, next) => {
            const { data } = req.body;
            console.log("X");
            
            if (!data.length) return;
            console.log("Y");

            this.handler.broadcast("twitch_event", data[0]);
        });

        /*
                                                           - - - - - - - - - -

                                                                INIT SERVER

                                                           - - - - - - - - - -
        */

        this.listen(port, () => console.log(`Express Server Created | Listening on Port :${port}`));
    }
}

module.exports = IPC;
