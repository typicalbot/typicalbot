const request = require("request");

module.exports = {
    "ping": {
        dm: true,
        mode: "strict",
        usage: {"command": "ping", "description": "A check to see if TypicalBot is responsive."},
        execute: (message, client, response) => {
            let embed = message.guild.settings.embed === "Y";

            if (embed) {
                response.send("Pinging...").then(msg => {
                    msg.edit("", { embed: {
                        color: 0x00FF00,
                        description: `Pong! | Took ${msg.createdTimestamp - message.createdTimestamp}ms.`
                    }});
                });
            } else {
                response.send("Pinging...").then(msg => {
                    msg.edit(`Pong! | Took ${msg.createdTimestamp - message.createdTimestamp}ms.`);
                });
            }
        }
    },
    "mylevel": {
        mode: "strict",
        usage: {"command": "mylevel ['--here']", "description": "Gives you your permission level, specific to that server."},
        execute: (message, client, response) => {
            let embed = message.guild.settings.embed === "Y";
            let split = message.content.split(" ")[1];

            let level = split && split === "--here" ?
                client.functions.getPermissionLevel(message.guild, message.guild.settings, message.author, true) :
                client.functions.getPermissionLevel(message.guild, message.guild.settings, message.author);

            if (embed) {
                if (level === 0) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 0 | Server Member`} );
                if (level === 1) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 1 | Server DJ`} );
                if (level === 2) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 2 | Server Moderator`} );
                if (level === 3) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 3 | Server Administrator`} );
                if (level === 4) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 4 | Server Owner`} );
                if (level === 7) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 7 | TypicalBot Support`} );
                if (level === 8) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 8 | TypicalBot Staff`} );
                if (level === 9) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 9 | TypicalBot Management`} );
                if (level === 10) return response.send("", { color: 0x00ADFF, description: `**__Your Permission Level:__** 10 | TypicalBot Creator`} );
            } else {
                if (level === 0) return response.reply(`**__Your Permission Level:__** 0 | Server Member`);
                if (level === 1) return response.reply(`**__Your Permission Level:__** 1 | Server DJ`);
                if (level === 2) return response.reply(`**__Your Permission Level:__** 2 | Server Moderator`);
                if (level === 3) return response.reply(`**__Your Permission Level:__** 3 | Server Admin`);
                if (level === 4) return response.reply(`**__Your Permission Level:__** 4 | Server Owner`);
                if (level === 7) return response.reply(`**__Your Permission Level:__** 7 | TypicalBot Support`);
                if (level === 8) return response.reply(`**__Your Permission Level:__** 8 | TypicalBot Staff`);
                if (level === 9) return response.reply(`**__Your Permission Level:__** 9 | TypicalBot Management`);
                if (level === 10) return response.reply(`**__Your Permission Level:__** 10 | TypicalBot Creator`);
            }
        }
    },
    "serverinfo": {
        mode: "strict",
        usage: {"command": "serverinfo ['roles'/'channels'/'bots']", "description": "Lists the server's information."},
        execute: (message, client, response, userlevel) => {
            let embed = message.guild.settings.embed === "Y";
            let after = message.content.split(" ")[1];

            let owner = message.guild.owner ? message.guild.owner : message.guild.member(message.guild.ownerID);

            if (!after) {
                if (embed) {
                    return response.send("", {
                        "color": 0x00ADFF,
                        "description": `**__Server Information For:__** ${message.guild.name}`,
                        "fields": [
                            { "inline": true, "name": "Name", "value": `${message.guild.name}`},
                            { "inline": true, "name": "ID", "value": `${message.guild.id}`},
                            { "inline": true, "name": "Owner", "value": `${owner.user.username}#${owner.user.discriminator} (${owner.user.id})`},
                            { "inline": true, "name": "Created", "value": `${message.guild.createdAt}`},
                            { "inline": true, "name": "Region", "value": `${message.guild.region}`},
                            { "inline": true, "name": "Verification Level", "value": `${message.guild.verificationLevel}`},
                            { "inline": true, "name": "Channels", "value": `${message.guild.channels.size}`},
                            { "inline": true, "name": "Members", "value": `${message.guild.memberCount}`},
                            { "inline": true, "name": "Roles", "value": `${message.guild.roles.size}`},
                            { "inline": true, "name": "Emojis", "value": `${message.guild.emojis.size}`},
                        ],
                        "thumbnail": {
                            "url": message.guild.iconURL || null,
                        }
                    });
                } else {
                    return response.reply(
                        `**__Server Information For:__** ${message.guild.name}\n`
                        + `\`\`\`\n`
                        + `Name                : ${message.guild.name} (${message.guild.id})\n`
                        + `Owner               : ${owner.user.username}#${owner.user.discriminator} (${owner.user.id})\n`
                        + `Created             : ${message.guild.createdAt}\n`
                        + `Region              : ${message.guild.region}\n`
                        + `Verification Level  : ${message.guild.verificationLevel}\n`
                        + `Icon                : ${message.guild.iconURL ? message.guild.iconURL : "None"}\n`
                        + `Channels            : ${message.guild.channels.size}\n`
                        + `Members             : ${message.guild.memberCount}\n`
                        + `Roles               : ${message.guild.roles.size}\n`
                        + `Emojis              : ${message.guild.emojis.size}\n`
                        + `\`\`\``
                    );
                }
            }

            let lengthen = client.functions.lengthen;
            if (after === "roles") {
                let page = message.content.split(" ")[2];
                let paged = client.functions.pagify(
                    message.guild.roles.filter(r => r.position !== 0).array().sort((a,b) => b.position - a.position).map(r => `${lengthen(r.name, 20)} : ${r.id}`),
                    page
                );
                return response.reply(
                    `**__Roles for server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
                );
            }
            if (after === "channels") {
                let page = message.content.split(" ")[2];
                let paged = client.functions.pagify(
                    message.guild.channels.filter(c => c.type === "text").array().sort((a,b) => a.position - b.position).map(c => `${lengthen(c.name, 20)} : ${c.id}`),
                    page
                );
                return response.reply(
                    `**__Text Channels for server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
                );
            }
            if (after === "bots") {
                let page = message.content.split(" ")[2];
                let paged = client.functions.pagify(
                    message.guild.members.filter(m => m.user.bot).map(b => `${client.functions.lengthen(b.user.username, 20)} : ${b.user.id}`),
                    page
                );
                return response.reply(
                    `**__Bots in server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
                );
            }
            if (userlevel < 8) return;
            let settingslist = after === "s";

            let transmit = settingslist ?
                { channel: message.channel.id, guild: message.content.split(" ")[2], settings: true } :
                { channel: message.channel.id, guild: after };

            client.transmit("serverinfo", transmit);
        }
    },
    "userinfo": {
        mode: "lite",
        usage: {"command": "userinfo [@user]", "description": "Lists a user's information."},
        execute: (message, client, response) => {
            let user = message.mentions.users.array()[0];
            if (!user) user = message.author;
            let member = message.guild.member(user);
            response.reply(
                `**__User Information For:__** ${user.username}\n`
                + `\`\`\`\n`
                + `Name                : ${user.username}#${user.discriminator} (${user.id})\n`
                + (user.avatarURL ? `Avatar              : ${user.avatarURL}\n` : "")
                + `Joined Discord      : ${user.createdAt}\n`
                + `Status              : ${user.presence.status}\n`
                + (user.presence.game ? `Game                : ${user.presence.game.name}\n` : "")
                + (member.nickname ? `Nickname            : ${member.nickname}\n` : "")
                + (member.roles.size > 1 ? `Roles               : ${member.roles.array().filter(r => r.position !== 0).sort((a,b) => b.position - a.position).map(r => r.name).join(", ")}\n` : "")
                + `Joined Server       : ${member.joinedAt}\n`
                + `\`\`\``
            );
        }
    },
    "search": {
        mode: "lite",
        usage: {"command": "search <query> [page]", "description": "Searches in the user list for a username or nickname."},
        execute: (message, client, response) => {
            let match = /search\s+(\S+)(?:\s+(\d+))?/i.exec(message.content);
            if (!match) return response.usage("search");

            let context = match[1];
            let page = match[2] || 1;

            let members = message.guild.members.filter(m => {
                if (m.user.username.toLowerCase().includes(context.toLowerCase())) return true;
                if (m.nickname && m.nickname.toLowerCase().includes(context.toLowerCase())) return true;
                return false;
            });

            //message.guild.members.filter(m => m.user.bot).map(b => `${client.functions.lengthen(b.user.username, 20)} : ${b.user.id}`),

            if (members.size < 1) return response.reply("There are no matches.");

            let lengthen = client.functions.lengthen;

            let list = members.map(m => `${lengthen(m.user.username, 25)}${m.nickname ? `(${m.nickname})` : ""}`);

            let paged = client.functions.pagify(list, page);

            return response.reply(
                `**__Results for query \`${context}\`:__**\n\`\`\`autohotkey\n${paged}\`\`\``
            );
        }
    },
    "bots": {
        usage: {"command": "bots [page]", "description": "Gives a list of bots from Carbonitex ranked by server count."},
        execute: (message, client, response) => {
            client.functions.request("https://www.carbonitex.net/discord/api/listedbots").then(data => {
                let list = JSON.parse(data)
                    .filter(bot => bot.botid > 10 && bot.servercount > 0)
                    .sort((a,b) => b.servercount - a.servercount);

                let pages = [];
                let currPage = [];

                for (let bot in list) {
                    currPage.push(list[bot]);
                    if (currPage.length % 10 === 0) {
                        pages.push(currPage);
                        currPage = [];
                    }
                }
                if (currPage.length > 0) pages.push(currPage);

                let page = message.content.split(" ")[1];
                page = page && page > 0 && page <= pages.length ? page - 1 : 0;

                let lengthen = client.functions.lengthen;

                let thisPage = pages[page].map((bot, index) => {
                    return  `=> ${lengthen((index + 1) + 10 * page, String(10 + 10 * page).length, "before")}: `
                    + `${lengthen(bot.name.replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, ""), 20)} - `
                    + `${lengthen(Number(bot.servercount).toLocaleString(), Number(pages[page][0].servercount).toLocaleString().length, "before")} Servers`
                    + `${bot.compliant == "1" ? ` | Carbon Compliant` : ""}`;
                }).join("\n");
                response.send(`__\`Ranked Bot List - Provided by Carbonitex\`__\`\`\`autohotkey\nPage ${page + 1} / ${pages.length}\n\n${thisPage}\n\`\`\``);
            }).catch(err => response.error(`An error occured making that request.`));
        }
    },
    "strawpoll": {
        usage: {"command": "strawpoll <question> <{choice1;choice2;etc}>", "description": "Create a strawpoll vote."},
        execute: (message, client, response) => {
            let match = /strawpoll\s+(.+)\s+{(.+)}/i.exec(message.content);
            if (!match) return response.usage("strawpoll");
            let question = match[1];
            let choices = match[2];
            choices = choices.split(";");
            if (!choices.length > 1) return response.error(`Invalid command usage. There must be between 2 and 30 choices.`);
            request({
                "method": "POST",
                "url": "https://www.strawpoll.me/api/v2/polls",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "title": question,
                    "options": choices,
                    "multi": false
                })
            }, function(error, resp, body) {
                if (error || resp.statusCode !== 200) return response.error(`An error occured making that request.`);
                response.reply(`Your Strawpoll: <https://strawpoll.me/${JSON.parse(body).id}>`);
            });
        }
    },
    "discriminator": {
        mode: "lite",
        aliases: ["discrim"],
        usage: {"command": "discriminator [discrim|@user]", "description": "Provides a list of all uers with a given discriminator."},
        execute: (message, client, response) => {
            let match = /discrim(?:inator)?(?:\s+(?:(\d{4})|<(@!?\d+)>))?(?:\s+(\d+))?/i.exec(message.content);
            if (!match) return response.usage("discriminator");

            let discrim = match[1];
            let user = match[2] ? client.users.get(match[2]) : null;
            let page = match[3];

            let discriminator = discrim ? discrim : user ? user.discriminator : message.author.discriminator;

            let lengthen = client.functions.lengthen;

            let users = client.users.findAll("discriminator", discriminator);

            if (users.length < 1) return response.reply("There are no matches.");

            let list = users.map(u => u.username);

            let paged = client.functions.pagify(list, page);

            return response.reply(
                `**__Results for query \`${discriminator}\`:__**\n\`\`\`autohotkey\n${paged}\`\`\``
            );
        }
    },
    "randomuser": {
        mode: "lite",
        usage: {"command": "randomuser", "description": "Gives you a random user."},
        execute: (message, client, response) => {
            let user = message.guild.members.random().user;

            response.reply(`Your random pick is: **${user.username}#${user.discriminator}** (${user.id}).`);
        }
    },
    "nickname": {
        mode: "lite",
        aliases: ["nick"],
        usage: {"command": "nickname [nickname]", "description": "Changes your nickname."},
        execute: (message, client, response, level) => {
            let match = /nick(?:name)?(?:\s+<@!?(\d+)>)?(?:\s+([\S\s]+))?/i.exec(message.content);

            let member = message.guild.members.get(match[1]);
            let nick = match[2];
            let reset = !nick || nick === "reset";

            if (member) {
                if (level < 2) return response.error(`Your permission level is too low to execute that command. The command requires permission level 1 (${client.functions.numberToLevel(1)}) and you are level ${level} (${client.functions.numberToLevel(level)}).`);

                if (reset) return member.setNickname("").then(() => response.reply(`Successfully reset member's nickname.`)).catch(err => {
                    response.error(`An error occured. This most likely means I cannot manage member's nickname.`);
                });

                return member.setNickname(nick).then(() => response.reply(`Successfully changed member's nickname.`)).catch(err => {
                    response.error(`An error occured. This most likely means I cannot manage member's nickname.`);
                });
            }

            if (reset) return message.member.setNickname("").then(() => response.reply(`Successfully reset your nickname.`)).catch(err => {
                response.error(`An error occured. This most likely means I cannot manage your nickname.`);
            });

            message.member.setNickname(nick).then(() => response.reply(`Successfully changed your nickname.`)).catch(err => {
                response.error(`An error occured. This most likely means I cannot manage your nickname.`);
            });
        }
    }
};
