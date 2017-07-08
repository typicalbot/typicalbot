const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
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
        response.buildEmbed()
            .setColor(0x00adff)
            .setTitle("TypicalBot Lounge Invite")
            .setDescription(`You can join the TypicalBot Lounge [here](${this.client.config.urls.server}).`)
            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
            .setTimestamp()
            .send();
    }
};
