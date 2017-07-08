const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "reload",
            mode: "strict",
            permission: 9
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        const mod = message.content.slice(message.content.search(" ") + 1);

        this.client.transmit("reload", mod);

        response.buildEmbed()
            .setColor(0x00FF00)
            .setDescription(`**Reloading Module:** \`${mod}\``)
            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
            .setTimestamp()
            .send();
    }
};
