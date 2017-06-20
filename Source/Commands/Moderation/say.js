const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "say",
            description: "Customize your servers setting and enable/discord specific features.",
            usage: "settings <'view'|'edit'> <setting> <value>",
            mode: "strict",
            permission: 2
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {

    }
};
