const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "information",
            description: "Get general information about TypicalBot.",
            aliases: ["info"],
            usage: "information",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        response.send(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${this.client.config.urls.docs}>. If you need help, join us in the TypicalBot Lounge at <${this.client.config.urls.server}>.`);
    }

    embedExecute(message, response){
        let embed = new RichEmbed()
            .setColor(0x00ADFF)
            .setTitle("TypicalBot Information")
            .setDescription(`**Hello, I'm TypicalBot!** I was created by HyperCoder#2975. You can get a list of my commands with \`${this.client.config.prefix}commands\` and my documentation can be found at <${this.client.config.urls.docs}>. If you need help, join us in the TypicalBot Lounge at <${this.client.config.urls.server}>.`)
            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
            .setTimestamp();

        response.embed(embed);
    }
};
