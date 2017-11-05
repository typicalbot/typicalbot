const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gain the server's subscriber role.",
            usage: "subscribe",
            mode: "strict"
        });
    }

    execute(message, response, permissionLevel) {
        const role = message.guild.settings.subscriber ? message.guild.roles.get(message.guild.settings.subscriber) : null;
        if (message.guild.id === "163038706117115906") role = message.guild.roles.find("name", "Subscriber");

        if (!role) return response.error("No subscriber role is set up for this server.");

        message.member.addRole(Role).then(() => {
            response.reply("You are now subscribed!");
        });
    }

    embedExecute(message, response, permissionLevel) {
        const role = message.guild.settings.subscriber ? message.guild.roles.get(message.guild.settings.subscriber) : null;
        if (message.guild.id === "163038706117115906") role = message.guild.roles.find("name", "Subscriber");

        if (!role) return response.buildEmbed()
            .setColor(0xFF0000)
            .setTitle("Error")
            .setDescription(`No subscriber role is set up for this server.`)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();

        const Role = message.guild.roles.find("name", "Subscriber");

        message.member.addRole(Role).then(() => {
            response.buildEmbed()
                .setColor(0x00adff)
                .setTitle("Success")
                .setDescription("You are now subscribed!")
                .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
                .setTimestamp()
                .send();
        });
    }
};
