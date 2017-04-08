const Response = require("../Structures/Response");

class EventsManager {
    constructor(client) {
        this.client = client;
    }

    onceReady() {
        this.client.transmitStat("guilds");
        this.client.user.setGame(`Client Starting`);
        if (this.client.vr === "alpha" && this.client.guilds.has("163038706117115906")) this.client.functions.sendDonors();

        if (this.client.vr === "alpha") setTimeout(() => this.client.guilds.forEach(g => {
            if (!this.client.functions.alphaCheck(g)) g.leave();
        }), 5000);

        setInterval(() => {
            this.client.user.setGame(`${this.client.config.prefix}help | ${this.client.shardData.guilds} Servers`);

            if (this.client.vr === "alpha" && this.client.guilds.has("163038706117115906")) this.client.functions.sendDonors();
        }, 300000);
    }

    ready() {
        this.client.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.ws.ws.on("close", code => this.client.log(code));
    }

    async message(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;
            let command = this.client.commandsManager.get(message.content.split(" ")[0].slice(this.client.config.prefix.length));
            if (!command || !command.dm || command.permission > 0) return;

            let response = new Response(this.client, message);
            command.execute(message, response);
        } else {
            this.client.lastMessage = message.createdTimestamp;

            let BotMember = message.guild.member(this.client.user);
            if (!BotMember || !message.channel.permissionsFor(BotMember).hasPermission("SEND_MESSAGES")) return;

            let settings = await this.client.settingsManager.get(message.guild).catch(err => { return err; });

            if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) return message.channel.sendMessage(`${message.author} | This server's prefix is ${settings.customprefix ? settings.originaldisabled === "Y" ? `\`${settings.customprefix}\`` : `\`${this.client.config.prefix}\` or \`${settings.customprefix}\`` : `\`${this.client.config.prefix}\``}.`);

            message.guild.settings = settings;

            let userPermissions = this.client.permissionsManager.get(message.guild, message.author);
            if (userPermissions.level === -1) return;

            let response = new Response(this.client, message);
            if (userPermissions.level < 2) this.client.functions.inviteCheck(response);

            let split = message.content.split(" ")[0];
            let prefix = this.client.functions.getPrefix(message.author, settings, split);
            if (!prefix || !message.content.startsWith(prefix)) return;

            let command = this.client.commandsManager.get(split.slice(prefix.length).toLowerCase());
            if (!command) return;

            let mode = command.mode || "free";
            if (message.author.id !== this.client.config.owner && message.author.id !== message.guild.ownerID) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return response.error(`That command is not enabled on this server.`);

            if (userPermissions.level < command.permission) return response.perms(command, userPermissions);

            let actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);
            if (command.permission < 7 && (userPermissions.level === 7 || userPermissions.level === 8) && actualUserPermissions < command.permission) return response.perms(command, actualUserPermissions);

            settings.embed === "Y" && command.embedExecute ?
                command.embedExecute(message, response, userPermissions) :
                command.execute(message, response, userPermissions);
        }
    }

    async messageUpdate(oldMessage, message) {
        if (message.channel.type !== "text") return;

        let settings = await this.client.settingsManager.get(message.guild).catch(err => { return err; });

        let UserLevel = this.client.functions.getPermissionLevel(message.guild, settings, message.author);
        if (UserLevel >= 2) return;

        message.guild.settings = settings;

        let response = new Response(this.client, message);
        this.client.functions.inviteCheck(response);
    }

    async messageDelete(message) {
        if (message.channel.type !== "text") return;

        let settings = await this.client.settingsManager.get(message.guild).catch(err => { return err; });

        if (!settings.logs || !settings.deletelog) return;

        let channel = message.guild.channels.get(settings.logs);
        if (!channel) return;

        let user = message.author;

        settings.deletelogs === "--embed" ?
        channel.sendEmbed({
            "color": 0x3EA7ED,
            "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": user.avatarURL || null },
            "footer": { "text": "User Unbanned" },
            "timestamp": new Date()
        }).catch() :
        channel.sendMessage(
            settings.unbanlog !== "--enabled" ?
                this.client.functions.getFilteredMessage("ann", message.guild, user, settings.unbanlog) :
                `**${user.username}#${user.discriminator}** has been unbanned from the server.`
        ).catch();
    }
}

module.exports = EventsManager;
