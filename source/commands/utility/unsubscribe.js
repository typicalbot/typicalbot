const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Remove the server's subscriber role from yourself.",
            usage: "unsubscribe",
            mode: "strict"
        });
    }

    execute(message, parameters, permissionLevel) {
        let role = message.guild.settings.subscriber ? message.guild.roles.get(message.guild.settings.subscriber) : null;
        if (message.guild.id === "163038706117115906") role = message.guild.roles.find("name", "Subscriber");

        if (!role) return message.error("No subscriber role is set up for this server.");

        message.member.removeRole(role).then(() => {
            message.reply("You are now unsubscribed!");
        });
    }

    embedExecute(message, response){
        let role = message.guild.settings.subscriber ? message.guild.roles.get(message.guild.settings.subscriber) : null;
        if (message.guild.id === "163038706117115906") role = message.guild.roles.find("name", "Subscriber");

        if (!role) return message.buildEmbed()
            .setColor(0xFF0000)
            .setTitle("Error")
            .setDescription(`No subscriber role is set up for this server.`)
            .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
            .setTimestamp()
            .send();

        message.member.removeRole(role).then(() => {
            message.buildEmbed()
                .setColor(0x00adff)
                .setTitle("Success")
                .setDescription("You are no longer subscribed!")
                .setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png")
                .setTimestamp()
                .send();
        });
    }
};
