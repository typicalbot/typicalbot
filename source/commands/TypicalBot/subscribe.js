const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Subscribe to TypicalBot's announcements.",
            usage: "subscribe",
            mode: "strict"
        });
    }

    execute(message, response, permissionLevel) {
        if (message.guild.id !== "163038706117115906") return response.error(`You must be in TypicalBot's Lounge in order to use this command.`);

        const Role = message.guild.roles.find("name", "Subscriber");

        message.member.addRole(Role).then(() => {
            response.reply("You are now subscribed to TypicalBot's announcements!");
        });
    }

    embedExecute(message, response, permissionLevel) {
        if (message.guild.id !== "163038706117115906") return response.buildEmbed()
            .setColor(0xFF0000)
            .setTitle("Error")
            .setDescription(`You must be in TypicalBot's Lounge in order to use this command.`)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();

        const Role = message.guild.roles.find("name", "Subscriber");

        message.member.addRole(Role).then(() => {
            response.buildEmbed()
                .setColor(0x00adff)
                .setTitle("Success")
                .setDescription("You are now subscribed to TypicalBot's announcements!")
                .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
                .setTimestamp()
                .send();
        });
    }
};
