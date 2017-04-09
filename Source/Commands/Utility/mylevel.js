const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

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

        let permission = split && split === "--here" ?
            this.client.permissionsManager.get(message.guild, message.author, true) :
            this.client.permissionsManager.get(message.guild, message.author);

        response.reply(`**__Your Permission Level:__** ${permission.level} | ${permission.title}`);
    }

    embedExecute(message, response, permissionLevel) {
        let split = message.content.split(" ")[1];

        let permission = split && split === "--here" ?
            this.client.permissionsManager.get(message.guild, message.author, true) :
            this.client.permissionsManager.get(message.guild, message.author);

        let embed = new RichEmbed()
            .setColor(0x00adff)
            .setTitle("User Permission Level")
            .setDescription(`Level ${permission.level} | ${permission.title}`);

        response.embed(embed);
    }
};
