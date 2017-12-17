const express = require("express");
const bodyParser = require("body-parser");

class IPC extends express {
    constructor(master) {
        super();

        this.master = master;

        this.use(bodyParser.json());

        /*
                                                           - - - - - - - - - -

                                                                ENDPOINTS

                                                           - - - - - - - - - -
        */

        this.get("/stats", (req, res, next) => {
            res.sendJSON(master.stats);
        });

        this.get("/guilds/:guildid", (req, res, next) => {
            const guild = req.params.guildid;

            this.master.shardRequest("guildData", { guild }).then(data => {
                return res.status(200).sendJSON(data);
            }).catch(() => {
                return res.status(500).sendJSON({ "message": "Request Timed Out" });
            });
        });

        this.post("/guilds/:guildid/leave", (req, res, next) => {
            const guild = req.params.guildid;

            this.master.shardRequest("leaveGuild", { guild }).then(data => {
                return res.status(200);
            }).catch(() => {
                return res.status(500).sendJSON({ "message": "Request Timed Out" });
            });
        });

        this.get("/guilds/:guildid/users/:userid", (req, res, next) => {
            const guild = req.params.guildid;
            const user = req.params.userid;

            this.master.shardRequest("userData", { guild, user }).then(data => {
                if (data.permissions.level < 2) return res.redirect("/access-denied");

                return res.status(200).sendJSON(data);
            }).catch(() => {
                return res.status(500).sendJSON({ "message": "Request Timed Out" });
            });
        });

        /*
                                                           - - - - - - - - - -

                                                                INIT SERVER

                                                           - - - - - - - - - -
        */

        this.listen("10000", () => console.log(`Express Server Created | Listening on Port :${this.config.port}`));
    }
}

module.exports = IPC;
