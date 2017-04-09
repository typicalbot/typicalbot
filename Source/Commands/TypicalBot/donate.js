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
        response.send(`**Donations can be sent here:** <${this.client.config.urls.donate}>\n\nDonations go to the creator of TypicalBot for any finances.`);
    }

    embedExecute(message, response){
        let embed = new RichEmbed()
            .setColor(0x00ADFF)
            .setTitle("Donate to TypicalBot's Creator")
            .setDescription(`You can donate to TypicalBot's creator [here](${this.client.config.urls.donate}>).\n\nDonations go to the creator of TypicalBot for any finances.`)
            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png");

        response.embed(embed);
    }
};
