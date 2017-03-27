const request = require("request");
const Response = require("./Response.js");

module.exports = class Events {
    constructor(client) {
        this.client = client;
    }

    message(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;
            let command = this.client.commandsManager.get(message.content.split(" ")[0].slice(this.client.config.prefix.length));
            if (!command || !command.dm || command.permission > 0) return;

            let response = new Response(this.client, message);
            command.execute(message, this.client, response);
        } else {
            this.client.lastMessage = message.createdTimestamp;

            let BotMember = message.guild.member(this.client.user);
            if (!BotMember || !message.channel.permissionsFor(BotMember).hasPermission("SEND_MESSAGES")) return;

            this.client.settingsManager.get(message.guild).then(settings => {
                if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) return message.channel.sendMessage(`${message.author} | This server's prefix is ${settings.customprefix ? settings.originaldisabled === "Y" ? `\`${settings.customprefix}\`` : `\`${this.client.config.prefix}\` or \`${settings.customprefix}\`` : `\`${this.client.config.prefix}\``}.`);

                message.guild.settings = settings;

                let UserLevel = this.client.functions.getPermissionLevel(message.guild, settings, message.author);
                if (UserLevel === -1) return;

                let response = new Response(this.client, message);
                if (UserLevel < 2) this.client.functions.inviteCheck(response);

                let split = message.content.split(" ")[0];
                let prefix = this.client.functions.getPrefix(message.author, settings, split);
                if (!prefix || !message.content.startsWith(prefix)) return;

                let command = this.client.commandsManager.get(split.slice(prefix.length).toLowerCase());
                if (!command) return;

                let mode = command.mode || "free";
                if (message.author.id !== this.client.config.owner && message.author.id !== message.guild.ownerID) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return response.error(`That command is not enabled on this server.`);

                if (command.permission && UserLevel < command.permission) return response.perms(command.permission, UserLevel);
                if (command.permission && command.permission < 7 && (UserLevel === 7 || UserLevel === 8) && this.client.functions.getPermissionLevel(message.guild, settings, message.author, true) < command.permission) return response.perms(command.permission, UserLevel);

                command.execute(message, this.client, response, UserLevel);
            });
        }
    }

    messageUpdate(oldMessage, message) {
        if (message.channel.type !== "text") return;

        this.client.settingsManager.get(message.guild).then(settings => {
            let UserLevel = this.client.functions.getPermissionLevel(message.guild, settings, message.author);
            if (UserLevel >= 2) return;

            message.guild.settings = settings;

            let response = new Response(this.client, message);
            this.client.functions.inviteCheck(response);
        });
    }

    voiceConnectionChange() {
        this.client.transmitStat("voiceConnections");
    }

    guildMemberAdd(member) {
        let guild = member.guild;
        this.client.settingsManager.get(guild.id).then(settings => {
            let user = member.user;

            if (settings.logs && settings.joinlog !== "--disabled") {
                let channel = guild.channels.get(settings.logs);
                if (channel) {
                    let useembed = settings.joinlog === "--embed";
                    useembed ?
                        channel.sendEmbed({
                            "color": 0x00FF00,
                            "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": user.avatarURL || null },
                            "footer": { "text": "User Joined" },
                            "timestamp": new Date()
                        }).catch() :
                        channel.sendMessage(
                            settings.joinlog ?
                                this.client.functions.getFilteredMessage("ann", guild, user, settings.joinlog) :
                                `**${user.username}#${user.discriminator}** has joined the server.`
                        ).catch();
                }
            }

            if (settings.joinmessage && !user.bot) user.sendMessage(`**${guild.name}'s Join Message:**\n\n${this.client.functions.getFilteredMessage("jm", guild, user, settings.joinmessage)}'`).catch();

            if (settings.joinnick) member.setNickname(this.client.functions.getFilteredMessage("jn", guild, user, settings.joinnick)).catch();

            let joinrole = this.client.functions.fetchRole(guild, settings, "joinrole");
            if (joinrole && joinrole.editable) setTimeout(() =>
                member.addRole(joinrole).catch(err => console.error(err)), 2000
            );
        });
    }

    guildMemberRemove(member) {
        let guild = member.guild;

        const continueleave = () => {
            this.client.settingsManager.get(guild.id).then(settings => {
                let user = member.user;

                if (!settings.logs || settings.leavelog === "--disabled") return;

                let channel = guild.channels.get(settings.logs);
                if (!channel) return;

                let useembed = settings.leavelog === "--embed";
                useembed ?
                    channel.sendEmbed({
                        "color": 0xFF6600,
                        "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": user.avatarURL || null },
                        "footer": { "text": "User Left" },
                        "timestamp": new Date()
                    }).catch() :
                    channel.sendMessage(
                        settings.leavelog ?
                            this.client.functions.getFilteredMessage("ann", guild, user, settings.leavelog) :
                            `**${user.username}#${user.discriminator}** has left the server.`
                    ).catch();
            });
        };

        guild.fetchBans().then(bans => bans.has(member.id) ? null : continueleave()).catch(() => continueleave());
    }

    guildBanAdd(guild, user) {
        this.client.settingsManager.get(guild.id).then(settings => {
            if (settings.modlogs && !this.client.softbans.has(user.id)) {
                let hasmod = this.client.banLogs.get(user.id);

                let log = Object.assign({ action: "ban", user }, hasmod);
                this.client.modlogManager.createLog(guild, log);
                this.client.banLogs.delete(user.id);
            }

            if (!settings.logs || settings.banlog === "--disabled") return;

            let channel = guild.channels.get(settings.logs);
            if (!channel) return;

            let useembed = settings.banlog === "--embed";
            useembed ?
                channel.sendEmbed({
                    "color": 0xFF0000,
                    "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": user.avatarURL || null },
                    "footer": { "text": "User Banned" },
                    "timestamp": new Date()
                }).catch() :
                channel.sendMessage(
                    settings.banlog ?
                        this.client.functions.getFilteredMessage("ann", guild, user, settings.banlog) :
                        `**${user.username}#${user.discriminator}** has been banned from the server.`
                ).catch();
        });
    }

    guildBanRemove(guild, user) {
        this.client.settingsManager.get(guild.id).then(settings => {
            if (settings.modlogs && !this.client.softbans.has(user.id)) {
                let hasmod = this.client.unbanLogs.get(user.id);

                let log = Object.assign({ action: "unban", user }, hasmod);
                this.client.modlogManager.createLog(guild, log);
                this.client.unbanLogs.delete(user.id);
            }

            if (!settings.logs || !settings.unbanlog) return;

            let channel = guild.channels.get(settings.logs);
            if (!channel) return;

            let useembed = settings.unbanlog === "--embed";
            useembed ?
                channel.sendEmbed({
                    "color": 0x3EA7ED,
                    "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": user.avatarURL || null },
                    "footer": { "text": "User Unbanned" },
                    "timestamp": new Date()
                }).catch() :
                channel.sendMessage(
                    settings.unbanlog !== "--enabled" ?
                        this.client.functions.getFilteredMessage("ann", guild, user, settings.unbanlog) :
                        `**${user.username}#${user.discriminator}** has been unbanned from the server.`
                ).catch();
        });
    }

    guildMemberUpdate(oldMember, newMember) {
        let guild = newMember.guild;
        let oldNick = oldMember.nickname;
        let newNick = newMember.nickname;
        if (oldNick !== newNick) {
            this.client.settingsManager.get(guild).then(settings => {
                if (!settings.logs || !settings.nicklog) return;

                let user = newMember.user;

                let channel = guild.channels.get(settings.logs);
                if (!channel) return;

                if (settings.joinnick && newNick === this.client.functions.getFilteredMessage("jn", guild, user, settings.joinnick)) return;

                channel.sendMessage(
                    settings.nicklog !== "--enabled" ?
                    this.client.functions.getFilteredMessage("ann-nick", guild, user, settings.nicklog, { oldMember }) :
                    `**${user.username}#${user.discriminator}** changed their nickname to **${newMember.nickname || user.username}**.`
                ).catch();
            });
        }
    }

    guildInvitePosted(guild, mchannel, user) {
        this.client.settingsManager.get(guild).then(settings => {
            if (!settings.logs || !settings.invitelog) return;

            let channel = guild.channels.get(settings.logs);
            if (!channel) return;

            channel.sendMessage(
                settings.invitelog !== "--enabled" ?
                    this.client.functions.getFilteredMessage("ann-invite", guild, user, settings.invitelog, { channel: mchannel }) :
                    `**${user.username}#${user.discriminator}** posted an invite in <#${mchannel.id}>.`);
        });
    }

    guildCreate(guild) {
        if (this.client.vr === "alpha") {
            let check = this.client.functions.alphaCheck(guild);
            console.log(`${guild.owner.user.username} | ${check}`);
            if (!check) setTimeout(() => guild.leave(), 2000);
        }

        if (this.client.vr === "stable") this.client.functions.sendStats("b");

        this.client.transmitStat("guilds");
    }

    guildDelete(guild) {
        this.client.transmitStat("guilds");
        this.client.settingsManager.delete(guild.id);
    }
};
