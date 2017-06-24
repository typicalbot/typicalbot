const Discord = require("discord.js");
const RichEmbed = Discord.RichEmbed;
const Response = require("../Structures/Response");
const util = require("util");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    onceReady() {
        this.client.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.transmitStat("guilds");
        this.client.user.setGame(`Client Starting`);
        this.client.functions.transmitStatus();
        this.client.transmit("transmitDonors");
        this.client.transmit("transmitTesters");

        if (this.client.vr === "alpha") setTimeout(() => this.client.guilds.forEach(g => {
            if (!this.client.functions.checkDonor(g)) g.leave();
        }), 10000);

        if (this.client.vr === "dev") setTimeout(() => this.client.guilds.forEach(g => {
            if (!this.client.functions.checkTester(g)) g.leave();
        }), 10000);

        setInterval(() => this.client.functions.transmitStatus(), 20000);

        setInterval(() => {
            this.client.user.setGame(`${this.client.config.prefix}help | ${this.client.shardData.guilds} Servers`);

            if (this.client.vr === "alpha" && this.client.guilds.has("163038706117115906")) this.client.functions.transmitDonors();
            if (this.client.vr === "dev" && this.client.guilds.has("163038706117115906")) this.client.functions.transmitTesters();
        }, 300000);
    }

    async message(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;
            const command = await this.client.commandsManager.get(message.content.split(" ")[0].slice(this.client.config.prefix.length));
            if (!command || !command.dm || command.permission > 0) return;

            const response = new Response(this.client, message);
            command.execute(message, response);
        } else {
            this.client.lastMessage = message.createdTimestamp;

            const BotMember = message.guild.member(this.client.user);
            if (!BotMember || !message.channel.permissionsFor(BotMember).has("SEND_MESSAGES")) return;

            const settings = await this.client.settingsManager.fetch(message.guild.id).catch(err => { return err; });

            if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) return message.channel.send(`${message.author} | This server's prefix is ${settings.customprefix ? settings.originaldisabled === "Y" ? `\`${settings.customprefix}\`` : `\`${this.client.config.prefix}\` or \`${settings.customprefix}\`` : `\`${this.client.config.prefix}\``}.`);

            message.guild.settings = settings;

            const userPermissions = this.client.permissionsManager.get(message.guild, message.author);
            if (userPermissions.level === -1) return;

            const response = new Response(this.client, message);
            if (userPermissions.level < 2) this.client.functions.inviteCheck(response);

            const split = message.content.split(" ")[0];
            const prefix = this.client.functions.matchPrefix(message.author, settings, split);
            if (!prefix || !message.content.startsWith(prefix)) return;

            const command = await this.client.commandsManager.get(split.slice(prefix.length).toLowerCase());
            if (!command) return;

            const mode = command.mode || "free";
            if (message.author.id !== this.client.config.owner && message.author.id !== message.guild.ownerID) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return response.error(`That command is not enabled on this server.`);

            if (userPermissions.level < command.permission) return response.perms(command, userPermissions);

            const actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);
            if (command.permission < 7 && (userPermissions.level === 7 || userPermissions.level === 8) && actualUserPermissions < command.permission) return response.perms(command, actualUserPermissions);

            settings.embed === "Y" && command.embedExecute ?
                command.embedExecute(message, response, userPermissions) :
                command.execute(message, response, userPermissions);
        }
    }

    async messageUpdate(oldMessage, message) {
        if (message.channel.type !== "text") return;

        message.guild.settings = await this.client.settingsManager.fetch(message.guild.id);

        const userPermissions = this.client.permissionsManager.get(message.guild, message.author);
        if (userPermissions.level >= 2) return;

        const response = new Response(this.client, message);

        const match = this.client.functions.inviteCheck(message.content) || this.client.functions.inviteCheck(util.inspect(response.message.embeds, { depth: 4 }));

        if (match && message.deletable) {
            this.client.eventsManager.guildInvitePosted(message.guild, message, message.author);
            message.delete().then(() => {
                response.error(`An invite url has been detected in your message. This server prohibits invites from being shared. Your message has been removed.`);
            });
        }
    }

    async messageDelete(message) {
        if (message.channel.type !== "text") return;

        const settings = await this.client.settingsManager.fetch(message.guild.id).catch(err => { return err; });

        if (!settings.logs || !settings.deletelog) return;

        const channel = message.guild.channels.get(settings.logs);
        if (!channel) return;

        const user = message.author;

        const embed = new RichEmbed()
            .setColor(0x3EA7ED)
            .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
            .setDescription(this.client.functions.shorten(message.content, 100))
            .setFooter("Message Deleted")
            .setTimestamp();

        if (settings.deletelog === "--embed") return channel.send("", { embed }).catch(() => console.log("Missing Permissions"));

        channel.send(
            settings.deletelog === "--enabled" ?
                `**${user.username}#${user.discriminator}**'s message was deleted.` :
                this.client.functions.formatMessage("logs-msgdel", message.guild, user, settings.deletelog, { message, channel: message.channel })
        ).catch(() => console.log("Missing Permissions"));
    }

    async guildMemberAdd(member) {
        const guild = member.guild;

        const settings = await this.client.settingsManager.fetch(guild.id);

        const user = member.user;

        if (settings.joinlog !== "disabled") {
            if (guild.channels.has(settings.logs)) {
                const channel = guild.channels.get(settings.logs);

                if (settings.joinlog === "--embed") {
                    const embed = new RichEmbed()
                        .setColor(0x00FF00)
                        .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                        .setFooter("User Joined")
                        .setTimestamp();

                    channel.send("", { embed }).catch(() => console.log("Missing Permissions"));
                } else {
                    channel.send(
                        settings.joinlog ?
                            this.client.functions.formatMessage("logs", guild, user, settings.joinlog) :
                            `**${user.username}#${user.discriminator}** has joined the server.`
                    ).catch(() => console.log("Missing Permissions"));
                }
            }
        }

        if (settings.automessage && !user.bot) user.sendMessage(`**${guild.name}'s Join Message:**\n\n${this.client.functions.formatMessage("jm", guild, user, settings.automessage)}`).catch(() => console.log("Missing Permissions"));

        if (settings.autonick) member.setNickname(this.client.functions.formatMessage("jn", guild, user, settings.autonick)).catch(() => console.log("Missing Permissions"));

        const autorole = this.client.functions.fetchAutoRole(guild, settings);
        if (autorole && autorole.editable) setTimeout(() =>
            member.addRole(autorole).then(() => {
                if (settings.autorolesilent === "N" && settings.logs && guild.channels.has(settings.logs)) guild.channels.get(settings.logs).sendMessage(`**${user.tag}** was given the autorole **${autorole.name}**.`);
            }).catch(() => console.log("Missing Permissions")), settings.autoroledelay || 2000
        );
    }

    async guildMemberRemove(member) {
        const guild = member.guild;

        const bans = await guild.fetchBans().catch(() => console.log("Missing Permissions"));
        if (bans instanceof require("discord.js").Collection && bans.has(member.id)) return;

        const settings = await this.client.settingsManager.fetch(guild.id);
        if (!settings.logs || settings.leavelog === "--disabled") return;

        const user = member.user;

        if (!guild.channels.has(settings.logs)) return;
        const channel = guild.channels.get(settings.logs);

        if (settings.leavelog === "--embed") {
            const embed = new RichEmbed()
                .setColor(0xFF6600)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Left")
                .setTimestamp();

            channel.send("", { embed }).catch(() => console.log("Missing Permissions"));
        } else {
            channel.sendMessage(
                settings.leavelog ?
                    this.client.functions.formatMessage("logs", guild, user, settings.leavelog) :
                    `**${user.tag}** has left the server.`
            ).catch(() => console.log("Missing Permissions"));
        }
    }

    async guildMemberUpdate(oldMember, member) {
        const guild = member.guild;

        const oldNickname = oldMember.nickname;
        const nickname = member.nickname;
        if (oldNickname === nickname) return;

        const settings = await this.client.settingsManager.fetch(guild.id);
        if (!settings.logs || !settings.nicklog) return;

        const user = member.user;

        if (!guild.channels.has(settings.logs)) return;
        const channel = guild.channels.get(settings.logs);

        if (settings.joinnick && nickname === this.client.functions.formatMessage("jn", guild, user, settings.joinnick)) return;

        channel.send(
            settings.nicklog !== "--enabled" ?
            this.client.functions.formatMessage("ann-nick", guild, user, settings.nicklog, { oldMember }) :
            `**${user.tag}** changed their nickname to **${member.nickname || user.username}**.`
        ).catch(() => console.log("Missing Permissions"));
    }

    async guildBanAdd(guild, user) {
        const settings = await this.client.settingsManager.fetch(guild.id);

        if (settings.modlogs && !this.client.softbanCache.has(user.id)) {
            const cachedLog = this.client.banCache.get(user.id);

            this.client.modlogsManager.createLog(guild, Object.assign({ action: "ban", user }, cachedLog));
            this.client.banCache.delete(user.id);
        }

        if (!settings.logs || settings.banlog === "--disabled") return;

        if (!guild.channels.has(settings.logs)) return;
        const channel = guild.channels.get(settings.logs);

        if (settings.banlog === "--embed") {
            const embed = new RichEmbed()
                .setColor(0xFF0000)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Banned")
                .setTimestamp();

            channel.send("", { embed }).catch(() => console.log("Missing Permissions"));
        } else {
            channel.send(
                settings.banlog ?
                    this.client.functions.formatMessage("logs", guild, user, settings.banlog) :
                    `**${user.tag}** has been banned from the server.`
            ).catch(() => console.log("Missing Permissions"));
        }
    }

    async guildBanRemove(guild, user) {
        const settings = await this.client.settingsManager.fetch(guild.id);

        if (settings.modlogs && !this.client.softbanCache.has(user.id)) {
            const cachedLog = this.client.unbanCache.get(user.id);

            this.client.modlogsManager.createLog(guild, Object.assign({ action: "unban", user }, cachedLog));
            this.client.unbanCache.delete(user.id);
        }

        if (!settings.logs || settings.unbanlog === "--disabled") return;

        if (!guild.channels.has(settings.logs)) return;
        const channel = guild.channels.get(settings.logs);

        if (settings.unbanlog === "--embed") {
            const embed = new RichEmbed()
                .setColor(0x3EA7ED)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Unbanned")
                .setTimestamp();

            channel.send("", { embed }).catch(() => console.log("Missing Permissions"));
        } else {
            channel.send(
                settings.unbanlog ?
                    this.client.functions.formatMessage("logs", guild, user, settings.unbanlog) :
                    `**${user.tag}** has been unbanned from the server.`
            ).catch(() => console.log("Missing Permissions"));
        }
    }

    async guildInvitePosted(guild, message, user) {
        const settings = await this.client.settingsManager.fetch(guild.id);
        if (!settings.logs || !settings.invitelog) return;

        const channel = guild.channels.get(settings.logs);
        if (!channel) return;

        channel.send(
            settings.invitelog === "--enabled" ?
                `**${user.username}#${user.discriminator}** posted an invite in <#${message.channel.id}>.` :
                this.client.functions.formatMessage("logs-invite", guild, user, settings.invitelog, { channel: message.channel })
        );
    }

    guildCreate(guild) {
        if (this.client.vr === "dev") {
            const check = this.client.functions.checkTester(guild);
            console.log(`${guild.owner.user.username} | ${check}`);
            if (!check) setTimeout(() => guild.leave(), 2000);
        }
        if (this.client.vr === "alpha") {
            const check = this.client.functions.checkDonor(guild);
            console.log(`${guild.owner.user.username} | ${check}`);
            if (!check) setTimeout(() => guild.leave(), 2000);
        }

        if (this.client.vr === "stable") this.client.functions.postStats("b");

        this.client.transmitStat("guilds");
    }

    guildDelete(guild) {
        this.client.transmitStat("guilds");
        this.client.settingsManager.delete(guild.id);
    }
};
