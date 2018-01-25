const express = require("express");
const bodyParser = require("body-parser");

const port = 5000;

class IPC extends express {
    constructor(master) {
        super();

        this.master = master;

        this.use(bodyParser.json());

        function isAuthenticated(req, res, next) {
            if (req.get("Authentication").replace("'", "") === this.master.config.apitoken) return next();
            return res.status(403).json({ "message": "Authentication Required" });
        }

        /*
                                                           - - - - - - - - - -

                                                                ENDPOINTS

                                                           - - - - - - - - - -
        */

        this.get("/stats", isAuthenticated, (req, res, next) => {
            res.json(master.stats);
        });

        this.get("/guilds/:guildid", isAuthenticated, (req, res, next) => {
            const guild = req.params.guildid;

            this.master.globalRequest("guildData", { guild }).then(data => {
                return res.status(200).json(data);
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err });
            });
        });

        this.post("/guilds/:guildid/leave", isAuthenticated, (req, res, next) => {
            const guild = req.params.guildid;

            this.master.globalRequest("leaveGuild", { guild }).then(data => {
                return res.status(200).json({ "message": "Success" });
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err  });
            });
        });

        this.get("/guilds/:guildid/users/:userid", isAuthenticated, (req, res, next) => {
            const guild = req.params.guildid;
            const user = req.params.userid;

            this.master.globalRequest("userData", { guild, user }).then(data => {
                if (data.permissions.level < 2) return res.redirect("/access-denied");

                return res.status(200).json(data);
            }).catch(err => {
                return res.status(500).json({ "message": "Request Timed Out", "error": err  });
            });
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
