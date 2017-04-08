const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "subscribe",
            description: "Subscribe to TypicalBot's announcements.",
            usage: "subscribe",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (message.guild.id !== "163038706117115906") return response.error(`You must be in TypicalBot's Lounge in order to use this command.`);

        let Role = message.guild.roles.find("name", "Subscriber");

        message.member.addRole(Role).then(() => {
            response.reply("You are now subscribed to TypicalBot's announcements!");
        });
    }

    embedExecute(message, response, permissionLevel) {
        let fail = new RichEmbed()
        .setColor(0xFF0000)
        .setTitle("Error")
        .setDescription(`You must be in TypicalBot's Lounge in order to use this command.`);

        let success = new RichEmbed()
        .setColor(0x00adff)
        .setTitle("Success")
        .setDescription("You are now subscribed to TypicalBot's announcements!");

        if (message.guild.id !== "163038706117115906") return response.embed(fail);

        let Role = message.guild.roles.find("name", "Subscriber");

        message.member.addRole(Role).then(() => {
            response.embed(success);
        });
    }
};
