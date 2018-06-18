const express = require("express");
const bodyParser = require("body-parser");
const build = require("../config").build;

const port = build === "stable" ? 5000 : build === "beta" ? 5001 : build === "development" ? 5002 : 5000;

class IPC extends express {
    constructor(master) {
        super();

        this.master = master;

        this.use(bodyParser.json());

        function isAuthenticated(req, res, next) {
            if (req.get("Authorization") && req.get("Authorization").replace("'", "") === this.master.config.apis.localhost) return next();
            return res.status(403).json({ "message": "Authorization Required" });
        }

        /*
                                                           - - - - - - - - - -

                                                                ENDPOINTS

                                                           - - - - - - - - - -
        */

        this.get("/stats", isAuthenticated.bind(this), (req, res, next) => {
            res.json(master.stats);
        });

        this.get("/guilds/:guildid", isAuthenticated.bind(this), (req, res, next) => {
            const guild = req.params.guildid;

            this.master.globalRequest("guildData", { guild }).then(data => {
                return res.status(200).json(data);
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err });
            });
        });

        this.post("/guilds/:guildid/leave", isAuthenticated.bind(this), (req, res, next) => {
            const guild = req.params.guildid;

            this.master.globalRequest("leaveGuild", { guild }).then(data => {
                return res.status(200).json({ "message": "Success" });
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err });
            });
        });

        this.get("/guilds/:guildid/users/:userid", isAuthenticated.bind(this), (req, res, next) => {
            const guild = req.params.guildid;
            const user = req.params.userid;

            this.master.globalRequest("userData", { guild, user }).then(data => {
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

            res.send(req.headers["hub.challenge"]);
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
