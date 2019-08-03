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

    async execute(message, parameters, permissionLevel) {
        const guilds = await this.client.fetchData("guilds.size");
        const voiceConnections = await this.client.fetchData("voice.connections.size");
        const channels = await this.client.fetchData("channels.size");
        const users = await this.client.fetchData("users.size");
        const usedRAM = await this.client.fetchData("usedRAM");
        const totalRAM = await this.client.fetchData("totalRAM");

        message.send(
            `**__TypicalBot's Statistics:__**\n`
            + `\`\`\`autohotkey\n`
            + `=> Uptime            : ${this.client.functions.convertTime(this.client.uptime)}\n`
            + `=> Servers           : ${guilds.toLocaleString()} (${this.client.shardCount} Shard${this.client.shardCount > 1 ? "s" : ""})\n`
            + `=> Voice Connections : ${voiceConnections.toLocaleString()}\n`
            + `=> Channels          : ${channels.toLocaleString()}\n`
            + `=> Users             : ${users.toLocaleString()}\n`
            + `=> CPU               : ${Math.round(loadavg()[0] * 10000) / 100}%\n`
            + `=> RAM (Used)        : ${usedRAM}MB\n`
            + `=> RAM (Total)       : ${totalRAM}MB\n`
            + `=> Library           : discord.js\n`
            + `=> Created By        : HyperCoder#2975 & nsylke#4490\n\n`
            + `    This Shard:\n`
            + `=> Shard             : ${this.client.shardNumber} / ${this.client.shardCount}\n`
            + `=> Servers           : ${this.client.guilds.size.toLocaleString()}\n`
            + `=> Voice Connections : ${this.client.voice.connections.size.toLocaleString()}\n`
            + `=> Channels          : ${this.client.channels.size.toLocaleString()}\n`
            + `=> Users             : ${this.client.users.size.toLocaleString()}\n`
            + `=> RAM (Used)        : ${Math.round(100 * (process.memoryUsage().heapUsed / 1048576)) / 100}MB\n`
            + `=> RAM (Total)       : ${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100}MB\n`
            + `=> Users             : ${this.client.users.size.toLocaleString()}\n`
            + `\`\`\``
        );
    }

    async embedExecute(message, parameters, permissionLevel) {
        const guilds = await this.client.fetchData`("guilds.size");
        const voiceConnections = await this.client.fetchData("voice.connections.size");
        const channels = await this.client.fetchData("channels.size");
        const users = await this.client.fetchData("users.size");
        const usedRAM = await this.client.fetchData("usedRAM");
        const totalRAM = await this.client.fetchData("totalRAM");

        message.buildEmbed()
            .setColor(0x00adff)
            .setThumbnail(Constants.Links.ICON)
            .setTitle("TypicalBot Statistics")
            .addField("» Uptime", this.client.functions.convertTime(this.client.uptime), true)
            .addField("» Servers", `${guilds.toLocaleString()} (${this.client.shardCount} Shard${this.client.shardCount > 1 ? "s" : ""})`, true)
            .addField("» Voice Connections", `${voiceConnections.toLocaleString()}`, true)
            .addField("» Channels", `${channels.toLocaleString()}`, true)
            .addField("» Users", `${users.toLocaleString()}`, true)
            .addField("» CPU Usage", `${Math.round(loadavg()[0] * 10000) / 100}%`, true)
            .addField("» RAM (Used)", `${usedRAM}MB`, true)
            .addField("» RAM (Total)", `${totalRAM}MB`, true)
            .addField("» Library", "discord.js", true)
            .addField("» Created By", "HyperCoder#2975\nnsylke#4490", true)
            .addBlankField()
            .addField("» Shard", `${this.client.shardNumber} / ${this.client.shardCount}`, true)
            .addField("» Servers", `${this.client.guilds.size.toLocaleString()}`, true)
            .addField("» Voice Connections", `${this.client.voice.connections.size.toLocaleString()}`, true)
            .addField("» Channels", `${this.client.channels.size.toLocaleString()}`, true)
            .addField("» Users", `${this.client.users.size.toLocaleString()}`, true)
            .addField("» RAM (Used)", `${Math.round(100 * (process.memoryUsage().heapUsed / 1048576)) / 100}MB`, true)
            .addField("» RAM (Total)", `${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100}MB`, true)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .setTimestamp()
            .send();
    }
};
