const request = require("request");

module.exports = class Events {
    constructor(client) {
        this.client = client;
    }

    ready() {
        this.client.log("Client connection initiated.");
        this.client.sendStat("guilds");
        this.client.bot.user.setGame("Client powering up...");
        this.intervalPost();
    }

    processMessage(message) {
        if (message.type === "stats") {
            this.client.data = message.data;
        } else if (message.type === "reload") {
            this.client.reload(message.module);
            this.client.log(`Reloading ${message.module}`);
        }
    }

    intervalStatus() {
        this.client.bot.user.setGame(`${this.client.config.prefix}help | ${this.client.data.guilds} Servers`);
    }

    intervalPost() {
        if (!this.client.config.main) return;
        request.post({url: 'https://www.carbonitex.net/discord/data/botdata.php', form: {
            "key": this.client.config.carbonkey,
            "shardid": this.client.ShardID.toString(),
            "shardcount": this.client.ShardCount.toString(),
            "servercount": this.client.bot.guilds.size.toString()
        }}, function(err, res, body) {
            if (err || res.statusCode != 200) {
                console.log("Sending server count failed!");
            } else {
                console.log("Successfully sent server count");
            }
        });

        request({
            "method": "POST",
            "url": "https://bots.discord.pw/api/bots/153613756348366849/stats",
            "headers": {
                "Authorization": this.client.config.discordpwkey,
                "Content-Type": "Application/JSON"
            },
            "body": JSON.stringify({
                "shard_id": this.client.ShardID.toString(),
                "shard_count": this.client.ShardCount.toString(),
                "server_count": this.client.bot.guilds.size.toString()
            })
        }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log("An error occured posting the server count.");
            } else {
                console.log("Sent Request!");
            }
        });
    }

    filterMessage(message) {
        if (message.guild.settings.antiinvite === "Y") {
            let match = /(discord\.gg\/.+|discordapp\.com\/invite\/.+)/gi.exec(message.content);
            if (match && message.deletable) {
                this.guildInvitePosted(message.guild, message.channel, message.author);
                message.delete().then(() => {
                    message.channel.sendMessage(`${message.author} | \`❗\` | Your message contained a server invite link, which this server prohibits.`);
                });
            }
        }
        if (message.guild.settings.antilink === "YY") {
            let urls = this.client.functions.getUrls(message.content);
            if (urls.length && message.deletable) {
                message.delete().then(() => {
                    message.channel.sendMessage(`${message.author} | \`❗\` | Your message contained a link, which this server prohibits.`);
                });
            }
        }
    }

    message(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") {
            if (!message.content.startsWith(this.client.config.prefix)) return;
            let command = this.client.commands.getCommand(message);
            if (!command || !command.dm) return;
            command.execute(message, this.client);
        } else {
            let BotMember = message.guild.member(this.client.bot.user);
            if (!BotMember || !message.channel.permissionsFor(BotMember).hasPermission("SEND_MESSAGES")) return;

            this.client.settings.get(message.guild).then(settings => {
                if (message.content.match(/^<@!?153613756348366849>$/)) return message.channel.sendMessage(`${message.author} | This server's prefix is ${settings.customprefix ? settings.originaldisabled === "Y" ? `\`${settings.customprefix}\`` : `\`${this.client.config.prefix}\` or \`${settings.customprefix}\`` : `\`${this.client.config.prefix}\``}.`);

                message.guild.settings = settings;

                let UserLevel = this.client.functions.getPermissionLevel(message.guild, settings, message.author);
                if (UserLevel < 2) this.filterMessage(message);
                if (UserLevel === -1) return;

                let split = message.content.split(" ")[0];
                let prefix = this.client.functions.getPrefix(settings, split);
                if (!prefix || !message.content.startsWith(prefix)) return;

                let command = this.client.commands.getCommand(split.slice(prefix.length));
                if (!command) return;

                let mode = command.mode || "free";
                if (message.author.id !== this.client.config.owner) if (settings.mode === "lite" && mode === "free" || settings.mode === "strict" && (mode === "free" || mode === "lite")) return message.channel.sendMessage(`${message.author} | \`❌\` | That command is not enabled on this server.`);

                if (command.permission && UserLevel < command.permission) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command.`);

                command.execute(message, this.client, UserLevel);
            });
        }
    }

    guildMemberAdd(member) {
        let guild = member.guild;
        this.client.settings.get(guild).then(settings => {
            if (settings.logs && settings.joinlog !== "--disabled") {
                let channel = guild.channels.get(settings.logs);
                if (channel && this.client.functions.messageable(channel)) {
                    try {
                        let useembed = settings.joinlog && settings.joinlog.startsWith("--embed");
                        if (useembed) {
                            let object = settings.joinlog.slice(8);
                            let embed = this.client.functions.getFilteredMessage("ann", guild, member.user, object);
                            embed = JSON.parse(embed);
                            if (embed.author && embed.author.icon_url && !embed.author.icon_url.startsWith("https://")) embed.author.icon_url = null;
                            channel.sendMessage("", { embed });
                        } else {
                            channel.sendMessage(settings.joinlog ? this.client.functions.getFilteredMessage("ann", guild, member.user, settings.joinlog) : `**${member.user.username}** has joined the server.`);
                        }
                    } catch(err) {
                        console.error(err);
                    }
                }
            }
            if (settings.joinmessage) member.user.sendMessage(`**${guild.name}'s Join Message:**\n\n${this.client.functions.getFilteredMessage("jm", guild, member.user, settings.joinmessage)}`);

            if (settings.joinnick && this.client.functions.nicknameable(member)) member.setNickname(this.client.functions.getFilteredMessage("jn", guild, member.user, settings.joinnick));

            let joinRole = this.client.functions.fetchRole(guild, settings, "joinrole");
            if (joinRole && joinRole.editable) {
                member.addRole(joinRole);
                if (settings.silent === "Y") return;
            }
        });
    }

    guildMemberRemove(member) {
        let guild = member.guild;
        this.client.functions.checkGuildBan(guild, member.user).then(banned => {
            if (banned) return;
            this.client.settings.get(guild).then(settings => {
                if (settings.logs && settings.leavelog !== "--disabled") {
                    let channel = guild.channels.get(settings.logs);
                    if (!channel || !this.client.functions.messageable(channel)) return;
                    try {
                        let useembed = settings.leavelog && settings.leavelog.startsWith("--embed");
                        if (useembed) {
                            let object = settings.leavelog.slice(8);
                            let embed = this.client.functions.getFilteredMessage("ann", guild, member.user, object);
                            embed = JSON.parse(embed);
                            if (embed.author && embed.author.icon_url && !embed.author.icon_url.startsWith("https://")) embed.author.icon_url = null;
                            channel.sendMessage("", { embed });
                        } else {
                            channel.sendMessage(settings.leavelog ? this.client.functions.getFilteredMessage("ann", guild, member.user, settings.leavelog) : `**${member.user.username}** has left the server.`);
                        }
                    } catch(err) {
                        console.error(err);
                    }
                }
            });
        });
    }

    guildBanAdd(guild, user) {
        this.client.settings.get(guild).then(settings => {
            if (settings.modlogs) this.client.modlog.log(guild, { action: "Ban", user });
            if (settings.logs && settings.banlog !== "--disabled") {
                let channel = guild.channels.get(settings.logs);
                if (!channel || !this.client.functions.messageable(channel)) return;
                try {
                    let useembed = settings.banlog && settings.banlog.startsWith("--embed");
                    if (useembed) {
                        let object = settings.banlog.slice(8);
                        let embed = this.client.functions.getFilteredMessage("ann", guild, user, object);
                        embed = JSON.parse(embed);
                        if (embed.author && embed.author.icon_url && !embed.author.icon_url.startsWith("https://")) embed.author.icon_url = null;
                        channel.sendMessage("", { embed });
                    } else {
                        channel.sendMessage(settings.banlog ? this.client.functions.getFilteredMessage("ann", guild, user, settings.banlog) : `**${user.username}** has been banned from the server.`);
                    }
                } catch(err) {
                    console.error(err);
                }
            }
        });
    }

    guildBanRemove(guild, user) {
        this.client.settings.get(guild).then(settings => {
            if (settings.modlogs) this.client.modlog.log(guild, { action: "Unban", user });
            if (settings.logs && settings.unbanlog) {
                let channel = guild.channels.get(settings.logs);
                if (!channel || !this.client.functions.messageable(channel)) return;
                try {
                    let useembed = settings.unbanlog && settings.unbanlog.startsWith("--embed");
                    if (useembed) {
                        let object = settings.unbanlog.slice(8);
                        let embed = this.client.functions.getFilteredMessage("ann", guild, user, object);
                        embed = JSON.parse(embed);
                        if (embed.author && embed.author.icon_url && !embed.author.icon_url.startsWith("https://")) embed.author.icon_url = null;
                        channel.sendMessage("", { embed });
                    } else {
                        channel.sendMessage(settings.unbanlog !== "--enabled" ? this.client.functions.getFilteredMessage("ann", guild, user, settings.unbanlog) : `**${user.username}** has been unbanned from the server.`);
                    }
                } catch(err) {
                    console.error(err);
                }
            }
        });
    }

    guildMemberUpdate(oldMember, newMember) {
        let guild = newMember.guild;
        let oldNick = oldMember.nickname;
        let newNick = newMember.nickname;
        if (!oldNick && newNick || oldNick && !newNick || oldNick && newNick && oldNick !== newNick) {
            this.client.settings.get(guild).then(settings => {
                if (settings.joinnick && newNick === this.client.functions.getFilteredMessage("jn", guild, newMember.user, settings.joinnick)) return;
                if (settings.logs && settings.nicklog) {
                    let channel = guild.channels.get(settings.logs);
                    if (!channel || !this.client.functions.messageable(channel)) return;
                    channel.sendMessage(settings.nicklog !== "--enabled" ? this.client.functions.getFilteredMessage("ann-nick", guild, newMember.user, settings.nicklog, { oldMember }) : `**${newMember.user.username}** changed their nickname to **${newMember.nickname || newMember.user.username}**.`);
                }
            });
        }
    }

    guildInvitePosted(guild, mchannel, user) {
        this.client.settings.get(guild).then(settings => {
            if (settings.logs && settings.invitelog) {
                let channel = guild.channels.get(settings.logs);
                if (!channel || !this.client.functions.messageable(channel)) return;
                channel.sendMessage(settings.invitelog !== "--enabled" ? this.client.functions.getFilteredMessage("ann-invite", guild, user, settings.invitelog, {channel: mchannel}) : `**${user.username}** has posted an invite in <#${mchannel.id}>.`);
            }
        });
    }

    guild() {
        this.client.sendStat("guilds", this.client.bot.guilds.size);
    }
};
