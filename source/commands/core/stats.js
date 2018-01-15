const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);
const { loadavg } = require('os');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Get TypicalBot's current statistics.",
            usage: "stats",
            dm: true,
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        message.send(
            `**__TypicalBot's Statistics:__**\n`
            + `\`\`\`autohotkey\n`
            + `=> Uptime            : ${this.client.functions.convertTime(this.client.uptime)}\n`
            + `=> Servers           : ${this.client.shardData.guilds.toLocaleString()} (${this.client.shardCount} Shard${this.client.shardCount > 1 ? "s" : ""})\n`
            + `=> Voice Connections : ${this.client.shardData.voiceConnections.toLocaleString()}\n`
            + `=> Library           : discord.js\n`
            + `=> Created By        : HyperCoder#2975\n\n`
            + `    This Shard:\n`
            + `=> Shard             : ${this.client.shardNumber} / ${this.client.shardCount}\n`
            + `=> Servers           : ${this.client.guilds.size.toLocaleString()}\n`
            + `=> Voice Connections : ${this.client.voiceConnections.size.toLocaleString()}\n`
            + `=> Channels          : ${this.client.channels.size.toLocaleString()}\n`
            + `=> Users             : ${this.client.users.size.toLocaleString()}\n`
            + `    Usage:\n`
            + `=> CPU               : ${Math.round(loadavg()[0] * 10000) / 100}%\n`
            + `=> RAM (Used)        : ${Math.round(100 * (process.memoryUsage().heapUsed / 1048576)) / 100}MB\n`
            + `=> RAM (Total)       : ${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100}MB\n`
            + `=> Users             : ${this.client.users.size.toLocaleString()}\n`
            + `\`\`\``
        );
    }

    embedExecute(message, parameters, permissionLevel) {
        message.buildEmbed()
            .setColor(0x00adff)
            .setThumbnail(Constants.Links.ICON)
            .setTitle("TypicalBot Statistics")
            .addField("» Uptime", this.client.functions.convertTime(this.client.uptime), true)
            .addField("» Servers", `${this.client.shardData.guilds.toLocaleString()} (${this.client.shardCount} Shard${this.client.shardCount > 1 ? "s" : ""})`, true)
            .addField("» Voice Connections", `${this.client.shardData.voiceConnections.toLocaleString()}`, true)
            .addField("» Library", "discord.js", true)
            .addField("» Created By", "HyperCoder#2975", true)
            .addField("» Shard", `${this.client.shardNumber} / ${this.client.shardCount}`, true)
            .addField("» Servers on Shard", `${this.client.guilds.size.toLocaleString()}`, true)
            .addField("» Voice Connections on Shard", `${this.client.voiceConnections.size.toLocaleString()}`, true)
            .addField("» Channels on Shard", `${this.client.channels.size.toLocaleString()}`, true)
            .addField("» Users on Shard", `${this.client.users.size.toLocaleString()}`, true)
            .addField("» CPU Usage", `${Math.round(loadavg()[0] * 10000) / 100}%`, true)
            .addField("» RAM (Used)", `${Math.round(100 * (process.memoryUsage().heapUsed / 1048576)) / 100}MB`, true)
            .addField("» RAM (Total)", `${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100}MB`, true)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
