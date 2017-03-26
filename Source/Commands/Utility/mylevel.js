const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "mylevel",
            description: "Shows you your permission level specific to the server requested it.",
            usage: "mylevel",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let split = message.content.split(" ")[1];

        let level = split && split === "--here" ?
            this.client.functions.getPermissionLevel(message.guild, message.guild.settings, message.author, true) :
            this.client.functions.getPermissionLevel(message.guild, message.guild.settings, message.author);

        if (level === 0) return response.reply(`**__Your Permission Level:__** 0 | Server Member`);
        if (level === 1) return response.reply(`**__Your Permission Level:__** 1 | Server DJ`);
        if (level === 2) return response.reply(`**__Your Permission Level:__** 2 | Server Moderator`);
        if (level === 3) return response.reply(`**__Your Permission Level:__** 3 | Server Admin`);
        if (level === 4) return response.reply(`**__Your Permission Level:__** 4 | Server Owner`);
        if (level === 7) return response.reply(`**__Your Permission Level:__** 7 | TypicalBot Support`);
        if (level === 8) return response.reply(`**__Your Permission Level:__** 8 | TypicalBot Staff`);
        if (level === 9) return response.reply(`**__Your Permission Level:__** 9 | TypicalBot Management`);
        if (level === 10) return response.reply(`**__Your Permission Level:__** 10 | TypicalBot Creator`);
    }
};
