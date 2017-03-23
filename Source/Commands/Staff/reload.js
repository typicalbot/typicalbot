const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "reload",
            mode: "strict",
            permission: 9
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let mod = message.content.slice(message.content.search(" ") + 1);

        this.client.transmit("reload", mod);

        response.send("", {
            "color": 0x00FF00,
            "description": `**Reloading Module:** \`${mod}\``
        });
    }
};
