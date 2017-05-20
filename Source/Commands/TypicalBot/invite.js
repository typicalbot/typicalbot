const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "invite",
            description: "Receive the OAuth2 authorization link for TypicalBot.",
            usage: "invite",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        response.reply(`You can add me to your server at <${this.client.config.urls.oauth}>.`);
    }

    embedExecute(message, response){
        let embed = new RichEmbed()
        .setColor(0x00adff)
        .setTitle("TypicalBot Invite Link")
        .setDescription(`You can add me to your server [here](${this.client.config.urls.oauth}).`)
        .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
        .setTimestamp();

        response.embed(embed);
    }
};
