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
        response.send(`**Documentation can be found here:** <${this.client.config.urls.donate}>\n\nDonations go to the creator of TypicalBot for any finances.`);
    }

    embedExecute(message, response){
        let embed = new RichEmbed()
        .setColor(0x00adff)
        .setTitle("Donation Information")
        .setDescription(`**Donations can be sent here:** <${this.client.config.urls.donate}>\n\nDonations go to the creator of TypicalBot for any finances.`);
        response.embed(embed);
    }
};
