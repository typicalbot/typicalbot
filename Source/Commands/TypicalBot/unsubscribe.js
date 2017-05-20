const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "unsubscribe",
            description: "Unsubscribe from TypicalBot's announcements.",
            usage: "unsubscribe",
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (message.guild.id !== "163038706117115906") return response.error(`You must be in TypicalBot's Lounge in order to use this command.`);

        let Role = message.guild.roles.find("name", "Subscriber");

        message.member.removeRole(Role).then(() => {
            response.reply("You are now unsubscribed from TypicalBot's announcements.");
        });
    }

    embedExecute(message, response){
        let fail = new RichEmbed()
        .setColor(0xFF0000)
        .setTitle("Error")
        .setDescription(`You must be in TypicalBot's Lounge in order to use this command.`);

        let success = new RichEmbed()
        .setColor(0x00adff)
        .setTitle("Success")
        .setDescription("You are no longer subscribed to TypicalBot's announcements!");

        if (message.guild.id !== "163038706117115906") return response.embed(fail);

        let Role = message.guild.roles.find("name", "Subscriber");

        message.member.removeRole(Role).then(() => {
            response.embed(success);
        });
    }
};
