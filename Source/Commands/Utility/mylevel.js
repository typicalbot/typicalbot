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
            this.client.permissionsManager.get(message.guild, message.author, true) :
            this.client.permissionsManager.get(message.guild, message.author);

        response.reply(`**__Your Permission Level:__** ${level.level} | ${level.title}`);
    }
};
