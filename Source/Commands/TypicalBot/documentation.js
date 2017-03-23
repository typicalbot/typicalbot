const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "documentation",
            description: "A check to see if TypicalBot is able to respond.",
            usage: "documentation",
            aliases: ["docs"],
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (message.guild.settings.embed === "Y") return response.send("", new RichEmbed()
            .setColor(0x00adff)
            .setTitle("TypicalBot Documentation")
            .setDescription(`You can find documentation for all commands and settings [here](${this.client.config.urls.docs}).`)
            .setFooter("TypicalBot", `${this.client.config.urls.website}/images/icon.png`)
        );

        response.send(`**Documentation can be found here:** <${this.client.config.urls.docs}>`);
    }
};
