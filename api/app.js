const express = require("express");
const bodyParser = require("body-parser");
const build = require("../config").build;

const port = build === "stable" ? 5000 : 5001;

class IPC extends express {
    constructor(handler) {
        super();

        this.handler = handler;

        this.use(bodyParser.json());

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
