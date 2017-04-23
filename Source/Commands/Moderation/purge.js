const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "purge",
            description: "Purge messages from a channel.",
            usage: "purge [@user|#channel|'bots'|@role] <number>",
            aliases: ["prune"],
            mode: "strict",
            permission: 2
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let match = /(?:purge|prune)(?:\s+(?:bots|<@!?(\d+)>|<#(\d+)>|<@&(\d+)>))?\s+(\d+)/i.exec(message.content);
    }
};
