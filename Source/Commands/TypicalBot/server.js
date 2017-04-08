const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "server",
            description: "Receive an invite to the TypicalBot Lounge.",
            usage: "server",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        response.reply(`You can join the TypicalBot Lounge at <${this.client.config.urls.server}>.`);
    }

    embedExecute(message, response){
        let embed = new RichEmbed()
        .setColor(0x00adff)
        .setTitle("TBL Invite URL")
        .setDescription(`You can join the TypicalBot Lounge at <${this.client.config.urls.server}>.`);

        reponse.embed(embed);

    }
};
