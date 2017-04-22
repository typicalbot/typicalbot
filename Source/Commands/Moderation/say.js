const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Customize your servers setting and enable/discord specific features.",
            usage: "settings <'view'|'edit'> <setting> <value>",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        
    }
};
