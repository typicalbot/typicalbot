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

        this.post("/channels/:channel/embed", (req, res, next) => {
            const apiKey = req.get("Authorization");
            const channel = req.params.channel;
            const json = req.body;

            this.handler.globalRequest("embed", { apiKey, channel, json }).then(data => {
                if (!data.success) return res.redirect("/access-denied");

                return res.status(200).json(data);
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err });
            });
        });

        this.listen(port, () => console.log(`Express Server Created | Listening on Port :${port}`));
    }
}

module.exports = IPC;
