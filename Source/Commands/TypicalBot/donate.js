const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "donate",
            description: "Donate to the cause of TypicalBot.",
            usage: "donate",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (message.guild.settings.embed === "Y") return response.send("", new RichEmbed()
            .setColor(0x00adff)
            .setTitle("TypicalBot Donations")
            .setDescription(`You can donate to TypicalBot [here](${this.client.config.urls.donate}).\n\nDonations go to the creator of TypicalBot for any finances.`)
            .setFooter("TypicalBot", `${this.client.config.urls.website}/images/icon.png`)
        );

        response.send(`**Documentation can be found here:** <${this.client.config.urls.donate}>\n\nDonations go to the creator of TypicalBot for any finances.`);
    }
};
