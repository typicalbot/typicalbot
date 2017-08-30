const { Collection } = require("discord.js");
const Response = require("../structures/Response");
const util = require("util");

module.exports = class {
    constructor(client) {
        this.client = client;

        this.mentionRegex = new RegExp(`^<@!?${this.client.config.id}>$`);
    }

    ready() {
        this.client.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.user.setGame(`Client Started`);
        this.client.transmitStats();
        this.client.transmit("transmitDonors");
        this.client.transmit("transmitTesters");

        setTimeout(() => {
            if (this.client.build === "alpha") this.client.guilds.forEach(g => { if (!this.client.functions.checkDonor(g)) g.leave(); });
            if (this.client.build === "development") this.client.guilds.forEach(g => { if (!this.client.functions.checkTester(g)) g.leave(); });
        }, 1000 * 60);

        setInterval(() => this.client.transmitStats(), 1000 * 30);

        setInterval(() => {
            this.client.user.setGame(`${this.client.config.prefix}help | ${this.client.shardData.guilds} Servers`);

            if (this.client.guilds.has("163038706117115906")) this.client.functions.transmitDonors();
            if (this.client.build === "dev" && this.client.guilds.has("163038706117115906")) this.client.functions.transmitTesters();
        }, 1000 * 60 * 5);
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

            const settings = await this.client.settingsManager.fetch(message.guild.id).catch(err => { return err; });

            if (message.content.match(this.mentionRegex)) return message.channel.send(`${message.author} | This server's prefix is ${settings.prefix.custom ? settings.prefix.default ? `\`${this.client.config.prefix}\` or \`${settings.prefix.custom}\`` : `\`${settings.prefix.custom}\`` : `\`${this.client.config.prefix}\``}.`);

            message.guild.settings = settings;

            const userPermissions = this.client.permissionsManager.get(message.guild, message.author);
            if (userPermissions.level === -1) return;

            const response = new Response(this.client, message);
            if (userPermissions.level < 2) this.client.automod.inviteCheck(response);

            const split = message.content.split(" ")[0];
            const prefix = this.client.functions.matchPrefix(message.author, settings, split);
            if (!prefix || !message.content.startsWith(prefix)) return;

            const command = await this.client.commandsManager.get(split.slice(prefix.length).toLowerCase());
            if (!command) return;

            const mode = command.mode || "free";
            if (message.author.id !== this.client.config.owner && message.author.id !== message.guild.ownerID) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return response.error(`That command is not enabled on this server.`);

            if (userPermissions.level < command.permission) return response.perms(command, userPermissions);

            const actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);
            if (command.permission < 6 && !userPermissions.global && actualUserPermissions < command.permission) return response.perms(command, actualUserPermissions);

            this.client.commandsStats[this.client.commandsStats.length - 1]++;

            settings.embed && command.embedExecute ?
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

        this.client.automod.inviteCheck(response).then(() => { return response.error(`An invite was detected in your message. Your message has been deleted.`); }).catch(console.error);
    }

    async messageDelete(message) {
        if (message.channel.type !== "text") return;

        const settings = await this.client.settingsManager.fetch(message.guild.id).catch(err => { return err; });

        if (!settings.logs.id || !settings.logs.delete) return;

        const channel = message.guild.channels.get(settings.logs.id);
        if (!channel) return;

        const user = message.author;

        if (settings.logs.delete === "--embed") return channel.buildEmbed()
            .setColor(0x3EA7ED)
            .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
            .setDescription(this.client.functions.shorten(message.content, 100))
            .setFooter("Message Deleted")
            .setTimestamp()
            .send()
            .catch(() => console.log("Missing Permissions"));


        channel.send(
            settings.logs.delete === "--enabled" ?
                `**${user.username}#${user.discriminator}**'s message was deleted.` :
                this.client.functions.formatMessage("logs-msgdel", message.guild, user, settings.logs.delete, { message, channel: message.channel })
        ).catch(() => console.log("Missing Permissions"));
    }

    async guildMemberAdd(member) {
        const guild = member.guild;

        const settings = await this.client.settingsManager.fetch(guild.id);

        const user = member.user;

        if (settings.logs.join !== "disabled") {
            if (guild.channels.has(settings.logs.id)) {
                const channel = guild.channels.get(settings.logs.id);

                if (settings.logs.join === "--embed") {
                    channel.buildEmbed()
                        .setColor(0x00FF00)
                        .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                        .setFooter("User Joined")
                        .setTimestamp()
                        .send()
                        .catch(() => console.log("Missing Permissions"));
                } else {
                    channel.send(
                        settings.logs.join ?
                            this.client.functions.formatMessage("logs", guild, user, settings.logs.join) :
                            `**${user.username}#${user.discriminator}** has joined the server.`
                    ).catch(() => console.log("Missing Permissions"));
                }
            }
        }

        if (settings.auto.message && !user.bot) user.send(`**${guild.name}'s Join Message:**\n\n${this.client.functions.formatMessage("jm", guild, user, settings.auto.message)}`).catch(() => console.log("Missing Permissions"));

        if (settings.auto.nickname) member.setNickname(this.client.functions.formatMessage("jn", guild, user, settings.auto.nickname)).catch(() => console.log("Missing Permissions"));

        const autorole = this.client.functions.fetchAutoRole(guild, settings);
        if (autorole && autorole.editable) setTimeout(() =>
            member.addRole(autorole).then(() => {
                if (settings.auto.role.silent === "N" && settings.logs.id && guild.channels.has(settings.logs.id)) guild.channels.get(settings.logs.id).send(`**${user.tag}** was given the autorole **${autorole.name}**.`);
            }).catch(() => console.log("Missing Permissions")), settings.audo.role.delay || 2000
        );
    }

    async guildMemberRemove(member) {
        const guild = member.guild;

        const bans = await guild.fetchBans().catch(() => console.log("Missing Permissions"));
        if (bans instanceof Collection && bans.has(member.id)) return;

        const settings = await this.client.settingsManager.fetch(guild.id);
        if (!settings.logs.id || settings.logs.leave === "--disabled") return;

        const user = member.user;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.logs.leave === "--embed") {
            channel.buildEmbed()
                .setColor(0xFF6600)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Left")
                .setTimestamp()
                .send()
                .catch(() => console.log("Missing Permissions"));
        } else {
            channel.send(
                settings.logs.leave ?
                    this.client.functions.formatMessage("logs", guild, user, settings.logs.leave) :
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
        if (!settings.logs.id || !settings.logs.nickname) return;

        const user = member.user;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.auto.nickname && nickname === this.client.functions.formatMessage("jn", guild, user, settings.auto.nickname)) return;

        channel.send(
            settings.logs.nickname !== "--enabled" ?
            this.client.functions.formatMessage("ann-nick", guild, user, settings.logs.nickname, { oldMember }) :
            `**${user.tag}** changed their nickname to **${member.nickname || user.username}**.`
        ).catch(() => console.log("Missing Permissions"));
    }

    async guildBanAdd(guild, user) {
        const settings = await this.client.settingsManager.fetch(guild.id);

        if (settings.logs.moderation && !this.client.softbanCache.has(user.id)) {
            const cachedLog = this.client.banCache.get(user.id);

            this.client.modlogsManager.createLog(guild, Object.assign({ action: "ban", user }, cachedLog));
            this.client.banCache.delete(user.id);
        }

        if (!settings.logs.id || settings.logs.ban === "--disabled") return;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.logs.ban === "--embed") {
            channel.buildEmbed()
                .setColor(0xFF0000)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Banned")
                .setTimestamp()
                .send()
                .catch(() => console.log("Missing Permissions"));
        } else {
            channel.send(
                settings.logs.ban ?
                    this.client.functions.formatMessage("logs", guild, user, settings.logs.ban) :
                    `**${user.tag}** has been banned from the server.`
            ).catch(() => console.log("Missing Permissions"));
        }
    }

    async guildBanRemove(guild, user) {
        const settings = await this.client.settingsManager.fetch(guild.id);

        if (settings.logs.moderation && !this.client.softbanCache.has(user.id)) {
            const cachedLog = this.client.unbanCache.get(user.id);

            this.client.modlogsManager.createLog(guild, Object.assign({ action: "unban", user }, cachedLog));
            this.client.unbanCache.delete(user.id);
        }

        if (!settings.logs.id || settings.logs.unban === "--disabled") return;

        if (!guild.channels.has(settings.logs.id)) return;
        const channel = guild.channels.get(settings.logs.id);

        if (settings.logs.unban === "--embed") {
            channel.buildEmbed()
                .setColor(0x3EA7ED)
                .setAuthor(`${user.tag} (${user.id})`, user.avatarURL() || null)
                .setFooter("User Unbanned")
                .setTimestamp()
                .send()
                .catch(() => console.log("Missing Permissions"));
        } else {
            channel.send(
                settings.logs.unban ?
                    this.client.functions.formatMessage("logs", guild, user, settings.logs.unban) :
                    `**${user.tag}** has been unbanned from the server.`
            ).catch(() => console.log("Missing Permissions"));
        }
    }

    async guildInvitePosted(guild, message, user) {
        const settings = await this.client.settingsManager.fetch(guild.id);
        if (!settings.logs.id || !settings.logs.invite) return;

        const channel = guild.channels.get(settings.logs.id);
        if (!channel) return;

        channel.send(
            settings.logs.invite === "--enabled" ?
                `**${user.username}#${user.discriminator}** posted an invite in <#${message.channel.id}>.` :
                this.client.functions.formatMessage("logs-invite", guild, user, settings.logs.invite, { channel: message.channel })
        );
    }

    guildCreate(guild) {
        if (this.client.build === "dev") {
            const check = this.client.functions.checkTester(guild);
            console.log(`${guild.owner.user.username} | ${check}`);
            if (!check) setTimeout(() => guild.leave(), 2000);
        }
        if (this.client.build === "alpha") {
            const check = this.client.functions.checkDonor(guild);
            console.log(`${guild.owner.user.username} | ${check}`);
            if (!check) setTimeout(() => guild.leave(), 2000);
        }

        if (this.client.build === "stable") this.client.functions.postStats("b");

        this.client.transmitStats();
    }

    guildDelete(guild) {
        this.client.transmitStats();
    }
};
