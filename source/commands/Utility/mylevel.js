const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Shows you your permission level specific to the server requested it.",
            usage: "mylevel",
            mode: "strict"
        });
    }

    execute(message, permissionLevel) {
        const split = message.content.split(" ")[1];

        const permission = split && split === "--here" ?
            this.client.permissionsManager.get(message.guild, message.author, true) :
            this.client.permissionsManager.get(message.guild, message.author);

        message.reply(`**__Your Permission Level:__** ${permission.level} | ${permission.title}`);
    }

    embedExecute(message, permissionLevel) {
        const split = message.content.split(" ")[1];

        const permission = split && split === "--here" ?
            this.client.permissionsManager.get(message.guild, message.author, true) :
            this.client.permissionsManager.get(message.guild, message.author);

        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle("User Permission Level")
            .setDescription(`Level ${permission.level} | ${permission.title}`)
            .send();
    }
};
