const RichEmbed = require("discord.js").RichEmbed;
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
            let command = await this.client.commandsManager.get(message.content.split(" ")[0].slice(this.client.config.prefix.length));
            if (!command || !command.dm || command.permission > 0) return;

            let response = new Response(this.client, message);
            command.execute(message, response);
        } else {
            this.client.lastMessage = message.createdTimestamp;

            let BotMember = message.guild.member(this.client.user);
            if (!BotMember || !message.channel.permissionsFor(BotMember).hasPermission("SEND_MESSAGES")) return;

            let settings = await this.client.settingsManager.fetch(message.guild).catch(err => { return err; });

            if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) return message.channel.sendMessage(`${message.author} | This server's prefix is ${settings.customprefix ? settings.originaldisabled === "Y" ? `\`${settings.customprefix}\`` : `\`${this.client.config.prefix}\` or \`${settings.customprefix}\`` : `\`${this.client.config.prefix}\``}.`);

            message.guild.settings = settings;

            let userPermissions = this.client.permissionsManager.get(message.guild, message.author);
            if (userPermissions.level === -1) return;

            let response = new Response(this.client, message);
            if (userPermissions.level < 2) this.client.functions.inviteCheck(response);

            let split = message.content.split(" ")[0];
            let prefix = this.client.functions.getPrefix(message.author, settings, split);
            if (!prefix || !message.content.startsWith(prefix)) return;

            let command = await this.client.commandsManager.get(split.slice(prefix.length).toLowerCase());
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

        let settings = await this.client.settingsManager.fetch(message.guild).catch(err => { return err; });

        let UserLevel = this.client.functions.getPermissionLevel(message.guild, settings, message.author);
        if (UserLevel >= 2) return;

        message.guild.settings = settings;

        let response = new Response(this.client, message);
        this.client.functions.inviteCheck(response);
    }

    async messageDelete(message) {
        if (message.channel.type !== "text") return;

        let settings = await this.client.settingsManager.fetch(message.guild).catch(err => { return err; });

        if (!settings.logs || !settings.deletelog) return;

        let channel = message.guild.channels.get(settings.logs);
        if (!channel) return;

        let user = message.author;

        if (settings.deletelog === "--embed") return channel.sendEmbed(new RichEmbed()
            .setColor(0x3EA7ED)
            .setAuthor(`${user.tag} (${user.id})`, user.avatarURL || null)
            .setDescription(this.client.functions.shorten(message.content, 100))
            .setFooter("Message Deleted")
            .setTimestamp()
        ).catch(() => this.client.log("Missing Permissions"));

        channel.sendMessage(
            settings.deletelog === "--enabled" ?
                `**${user.username}#${user.discriminator}**'s message was deleted.` :
                this.client.functions.getFilteredMessage("logs-msgdel", message.guild, user, settings.deletelog, { message, channel: message.channel })
        ).catch(() => this.client.log("Missing Permissions"));
    }

    async guildMemberAdd(member) {
        let guild = member.guild;

        let settings = await this.client.settingsManager.fetch(guild.id);

        let user = member.user;

        if (settings.joinlog !== "disabled") {
            if (guild.channels.has(settings.logs)) {
                let channel = guild.channels.get(settings.logs);

                if (settings.joinlog === "--embed") {
                    channel.sendEmbed(new RichEmbed()
                        .setColor(0x00FF00)
                        .setAuthor(`${user.tag} (${user.id})`, user.avatarURL || null)
                        .setFooter("User Joined")
                        .setTimestamp()
                    ).catch(() => this.client.log("Missing Permissions"));
                } else {
                    channel.sendMessage(
                        settings.joinlog ?
                            this.client.functions.getFilteredMessage("logs", guild, user, settings.joinlog) :
                            `**${user.username}#${user.discriminator}** has joined the server.`
                    ).catch(() => this.client.log("Missing Permissions"));
                }
            }
        }

        if (settings.joinmessage && !user.bot) user.sendMessage(`**${guild.name}'s Join Message:**\n\n${this.client.functions.getFilteredMessage("jm", guild, user, settings.joinmessage)}`).catch(() => this.client.log("Missing Permissions"));

        if (settings.joinnick) member.setNickname(this.client.functions.getFilteredMessage("jn", guild, user, settings.joinnick)).catch(() => this.client.log("Missing Permissions"));

        let autorole = this.client.functions.fetchAutoRole(guild, settings);
        if (autorole && autorole.editable) setTimeout(() =>
            member.addRole(autorole).then(() => {
                if (settings.autorolesilent === "N" && settings.logs && guild.channels.has(settings.logs)) guild.channels.get(settings.logs).sendMessage(`**${user.tag}** was given the autorole **${autorole.name}**.`);
            }).catch(() => this.client.log("Missing Permissions")), settings.autoroledelay || 2000
        );
    }
}

module.exports = EventsManager;
