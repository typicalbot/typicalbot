const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "donate",
            description: "Donate to the cause of TypicalBot.",
            usage: "donate",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        response.send(`**Documentation can be found here:** <${this.client.config.urls.donate}>\n\nDonations go to the creator of TypicalBot for any finances.`);
    }
};
