const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "settings",
            description: "Customize your servers setting and enable/discord specific features.",
            usage: "settings <'view'|'edit'> <setting> <value>",
            aliases: ["set"],
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let match = /(?:settings|set)\s+(list|view|edit)(?:\s+([\w-]+)\s*((?:.|[\r\n])+)?)?/i.exec(message.content);
        if (!match) return response.usage(this);

        let realPermissionLevel = this.client.permissionsManager.get(message.guild, message.author, true);

        let action = match[1], setting = match[2], value = match[3];

        if ((action === "view" || action === "edit") && realPermissionLevel.level < 2) return response.perms({ permission: 2 }, realPermissionLevel);

        if (action === "list") {
            response.reply("Settings List");
        } else if (action === "view") {
            response.reply("Settings View");
        } else if (action === "edit") {
            response.reply("Settings Edit");
        }
    }
};
