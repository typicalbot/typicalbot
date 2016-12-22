const request = require("request");
const Response = require("./Response.js");

module.exports = class Events {
    constructor(client) {
        this.client = client;
    }

    processMessage(message) {
        if (message.type === "stats") {
            this.client.data = message.data;
        } else if (message.type === "reload") {
            this.client.reload(message.data);
        } else if (message.type === "donors") {
            this.client.donors = message.data;
        } else if (message.type === "announcement") {
            if (this.client.channels.has("163039371535187968")) {
                this.client.channels.get("163039371535187968").sendMessage("<@&202467732975779850>", { embed: {
                    "title": "Announcement",
                    "description": message.data,
                    "color": 0x00adff,
                    "timestamp": new Date(),
                    "footer": {
                        "text": "TypicalBot Announcements",
                        "icon_url": "https://typicalbot.com/images/icon.png"
                    }
                }});
            }
        } else if (message.type === "channelmessage") {
            if (!this.client.channels.has(message.data.channel)) return;
            message.data.embed ?
                this.client.channels.get(message.data.channel).sendMessage("", { embed: message.data.content }) :
                this.client.channels.get(message.data.channel).sendMessage(message.data.content);
        } else if (message.type === "serverinfo") {
            if (!this.client.guilds.has(message.data.guild)) return;
            let guild = this.client.guilds.get(message.data.guild);
            let owner = guild.owner ? guild.owner.user : guild.member(guild.ownerID).user;

            this.client.settings.get(guild.id).then(settings => {
                let settingslist = [];
                Object.keys(settings).map(s => settingslist.push(`${s}: \`${settings[s]}\``));

                this.client.transmit("channelmessage", {
                    "embed": true,
                    "channel": message.data.channel,
                    "content": {
                        "color": 0x00adff,
                        "description": `**__Guild:__**\n${guild.name} | ${guild.id}\n\n**__Owner:__**\n${owner.username}#${owner.discriminator} | ${owner.id}\n\n`
                        + `**__Stats:__**\n**Members:** ${guild.memberCount}\n**Shard:** ${this.client.shardID}\n\n`
                        + `**__Roles:__**\n${guild.roles.map(r => `\`${r.name}\``).join(", ")}\n\n`
                        + `**__Channels:__**\n**Text:** ${guild.channels.filter(c => c.type === "text").map(c => `\`${c.name}\``).join(", ")}\n**Voice:** ${guild.channels.filter(c => c.type === "voice").map(c => `\`${c.name}\``).join(", ")}\n\n`
                        + `**__Settings:__**\n${settingslist.join(", ")}`,
                        "footer": { "text": "TypicalBot Support", "icon_url": "https://typicalbot.com/images/icon.png" },
                        "timestamp": new Date()
                    }
                });
            });
        }
    }

    statsPost() {
        request({
            "method": "POST",
            "url": "https://www.carbonitex.net/discord/data/botdata.php",
            "body": JSON.stringify({
                "key": this.client.config.carbonkey,
                "shardid": this.client.shardID.toString(),
                "shardcount": this.client.ShardCount.toString(),
                "servercount": this.client.guilds.size.toString()
            })
        }, (err, res, body) => { if (err || res.statusCode != 200) this.client.log("Carbon Post Failed", true); });

        request({
            "method": "POST",
            "url": "https://bots.discord.pw/api/bots/153613756348366849/stats",
            "headers": {
                "Authorization": this.client.config.discordpwkey,
                "Content-Type": "Application/JSON"
            },
            "body": JSON.stringify({
                "shard_id": this.client.shardID.toString(),
                "shard_count": this.client.ShardCount.toString(),
                "server_count": this.client.guilds.size.toString()
            })
        }, (err, res, body) => { if (err || res.statusCode != 200) this.client.log("DiscordPW Post Failed", true); });
    }

    sendDonors() {
        let donor = this.client.guilds.get("163038706117115906").roles.find("name", "Donor");
        let list = []; donor.members.forEach(m => list.push(m.id));
        this.client.transmit("donors", list);
    }

    message(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;
            let command = this.client.commands.getCommand(message);
            if (!command || !command.dm) return;

            let response = new Response(message);
            command.execute(message, this.client, response);
        } else {
            let BotMember = message.guild.member(this.client.user);
            if (!BotMember || !message.channel.permissionsFor(BotMember).hasPermission("SEND_MESSAGES")) return;

            this.client.settings.get(message.guild).then(settings => {
                if (message.content.match(/^<@!?153613756348366849>$/)) return message.channel.sendMessage(`${message.author} | This server's prefix is ${settings.customprefix ? settings.originaldisabled === "Y" ? `\`${settings.customprefix}\`` : `\`${this.client.config.prefix}\` or \`${settings.customprefix}\`` : `\`${this.client.config.prefix}\``}.`);

                message.guild.settings = settings;

                let UserLevel = this.client.functions.getPermissionLevel(message.guild, settings, message.author);
                if (UserLevel < 2) this.client.functions.inviteCheck(message);
                if (UserLevel === -1) return;

                let split = message.content.split(" ")[0];
                let prefix = this.client.functions.getPrefix(settings, split);
                if (!prefix || !message.content.startsWith(prefix)) return;

                let command = this.client.commands.get(split.slice(prefix.length));
                if (!command) return;

                let response = new Response(message);

                let mode = command.mode || "free";
                if (message.author.id !== this.client.config.owner) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return response.error(`That command is not enabled on this server.`);

                if (command.permission && UserLevel < command.permission) return response.error(`Your permission level is too low to execute that command.`);
                if (command.permission && command.permission < 4 && (UserLevel === 4 || UserLevel === 5) && this.client.functions.getPermissionLevel(message.guild, settings, message.author, true) < command.permission) return response.error(`Your permission level is too low to execute that command.`);

                command.execute(message, this.client, response, UserLevel);
            });
        }
    }

    guildMemberAdd(member) {
        let guild = member.guild;
        this.client.settings.get(guild.id).then(settings => {
            let user = member.user;

            if (settings.logs && settings.joinlogs !== "--disabled") {
                let channel = guild.channels.get(settings.logs);
                if (channel) {
                    let useembed = settings.joinlog === "--embed";
                    useembed ?
                        channel.sendEmbed({
                            "color": 0x00FF00,
                            "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": `${user.avatarURL || null}` },
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

            if (settings.joinmessage) user.sendMessage(`**${guild.name}'s Join Message:**\n\n${this.client.functions.getFilteredMessage("jm", guild, user, settings.joinmessage)}'`).catch();

            if (settings.joinnick) member.setNickname(this.client.functions.getFilteredMessage("jn", guild, user, settings.joinnick)).catch();

            let joinrole = this.client.functions.fetchRole(guild, settings, "joinrole");
            if (joinrole && joinrole.editable) member.addRole(joinrole);
        });
    }

    guildMemberRemove(member) {
        let guild = member.guild;

        const continueleave = () => {
            this.client.settings.get(guild.id).then(settings => {
                let user = member.user;

                if (!settings.logs || settings.leavelogs === "--disabled") return;

                let channel = guild.channels.get(settings.logs);
                if (!channel) return;

                let useembed = settings.leavelog === "--embed";
                useembed ?
                    channel.sendEmbed({
                        "color": 0xFF6600,
                        "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": `${user.avatarURL || null}` },
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
        this.client.settings.get(guild.id).then(settings => {
            if (settings.modlogs) this.client.modlog.log(guild, { action: "Ban", user });

            if (!settings.logs || settings.banlog === "--disabled") return;

            let channel = guild.channels.get(settings.logs);
            if (!channel) return;

            let useembed = settings.banlog === "--embed";
            useembed ?
                channel.sendEmbed({
                    "color": 0xFF0000,
                    "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": `${user.avatarURL || null}` },
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
        this.client.settings.get(guild.id).then(settings => {
            if (settings.modlogs) this.client.modlog.log(guild, { action: "Unban", user });

            if (!settings.logs || !settings.unbanlog) return;

            let channel = guild.channels.get(settings.logs);
            if (!channel) return;

            let useembed = settings.unbanlog === "--embed";
            useembed ?
                channel.sendEmbed({
                    "color": 0x3EA7ED,
                    "author": { "name": `${user.username}#${user.discriminator} (${user.id})`, "icon_url": `${user.avatarURL || null}` },
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
            this.client.settings.get(guild).then(settings => {
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
        this.client.settings.get(guild).then(settings => {
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
        if (this.client.config.bot === "alpha") if (!this.client.donors.includes(guild.ownerID)) return guild.leave();
        this.client.transmitStat("guilds");
    }

    guildDelete() {
        this.client.transmitStat("guilds");
    }
};
