const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "stats",
            description: "Get TypicalBot's current statistics.",
            usage: "stats",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (message.channel.permissionsFor(message.guild.member(this.client.user)).hasPermission("EMBED_LINKS")) return response.send("", new RichEmbed()
            .setColor(0x00adff)
            .setThumbnail(`${this.client.config.urls.website}/images/icon.png`)
            .setTitle("TypicalBot Statistics")
            .addField("» Uptime", this.client.functions.uptime, true)
            .addField("» Servers", `${this.client.shardData.guilds.toLocaleString()} (${this.client.shardCount} Shard${this.client.shardCount > 1 ? "s" : ""})`, true)
            .addField("» Library", "discord.js", true)
            .addField("» Created By", "HyperCoder#2975", true)
            .addField("» Shard", `${this.client.shardNumber} / ${this.client.shardCount}`, true)
            .addField("» Servers on Shard", `${this.client.guilds.size.toLocaleString()}`, true)
            .addField("» Channels on Shard", `${this.client.channels.size.toLocaleString()}`, true)
            .addField("» Users on Shard", `${this.client.users.size.toLocaleString()}`, true)
            .setFooter("TypicalBot", `${this.client.config.urls.website}/images/icon.png`)
        );

        response.send(
            `**__TypicalBot's Statistics:__**\n`
            + `\`\`\`autohotkey\n`
            + `=> Uptime            : ${this.client.functions.uptime}\n`
            + `=> Servers           : ${this.client.shardData.guilds.toLocaleString()} (${this.client.shardCount} Shard${this.client.shardCount > 1 ? "s" : ""})\n`
            //+ `=> Voice Connections : ${this.client.data.voiceConnections.toLocaleString()}\n`
            + `=> Library           : discord.js\n`
            + `=> Created By        : HyperCoder#2975\n\n`
            + `    This Shard:\n`
            + `=> Shard             : ${this.client.shardNumber} / ${this.client.shardCount}\n`
            + `=> Servers           : ${this.client.guilds.size.toLocaleString()}\n`
            + `=> Channels          : ${this.client.channels.size.toLocaleString()}\n`
            + `=> Users             : ${this.client.users.size.toLocaleString()}\n`
            + `\`\`\``
        );
    }
};
