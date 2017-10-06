const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "Shows you your permission level specific to the server requested it.",
            usage: "mylevel",
            mode: "strict"
        });
    }

    execute(message, response, permissionLevel) {
        const split = message.content.split(" ")[1];

        const permission = split && split === "--here" ?
            this.client.permissionsManager.get(message.guild, message.author, true) :
            this.client.permissionsManager.get(message.guild, message.author);

        response.reply(`**__Your Permission Level:__** ${permission.level} | ${permission.title}`);
    }

    embedExecute(message, response, permissionLevel) {
        const split = message.content.split(" ")[1];

        const permission = split && split === "--here" ?
            this.client.permissionsManager.get(message.guild, message.author, true) :
            this.client.permissionsManager.get(message.guild, message.author);

        response.buildEmbed()
            .setColor(0x00adff)
            .setTitle("User Permission Level")
            .setDescription(`Level ${permission.level} | ${permission.title}`)
            .send();
    }
};
