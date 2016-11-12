const request = require("request");

module.exports = {
    "ping": {
        dm: true,
        mode: "strict",
        usage: {"command": "ping", "description": "A check to see if TypicalBot is responsive."},
        execute: (message, client) => {
            message.channel.sendMessage("Pinging...").then(msg => msg.edit(`Pong! | Took ${msg.createdTimestamp - message.createdTimestamp}ms.`));
        }
    },
    "mylevel": {
        mode: "strict",
        usage: {"command": "mylevel", "description": "Gives you your permission level, specific to that server."},
        execute: (message, client) => {
            let level = client.functions.getPermissionLevel(message.guild, message.guild.settings, message.author);
            if (level === 0) return message.channel.sendMessage(`${message.author} | **__Your Permission Level:__** 0 | Server Member`);
            if (level === 1) return message.channel.sendMessage(`${message.author} | **__Your Permission Level:__** 1 | Server DJ`);
            if (level === 2) return message.channel.sendMessage(`${message.author} | **__Your Permission Level:__** 2 | Server Admin`);
            if (level === 3) return message.channel.sendMessage(`${message.author} | **__Your Permission Level:__** 3 | Server Owner`);
            if (level === 4) return message.channel.sendMessage(`${message.author} | **__Your Permission Level:__** 4 | TypicalBot Staff`);
            if (level === 5) return message.channel.sendMessage(`${message.author} | **__Your Permission Level:__** 5 | TypicalBot Creator`);
        }
    },
    "serverinfo": {
        mode: "strict",
        usage: {"command": "serverinfo ['roles'/'channels'/'bots']", "description": "Lists the server's information."},
        execute: (message, client) => {
            let after = message.content.split(" ")[1];
            if (!after) return message.channel.sendMessage(
                `**__Server Information For:__** ${message.guild.name}\n`
                + `\`\`\`\n`
                + `Name                : ${message.guild.name} (${message.guild.id})\n`
                + `Owner               : ${message.guild.owner.user.username}#${message.guild.owner.user.discriminator} (${message.guild.owner.user.id})\n`
                + `Created             : ${message.guild.createdAt}\n`
                + `Region              : ${message.guild.region}\n`
                + `Verification Level  : ${message.guild.verificationLevel}\n`
                + `Icon                : ${message.guild.iconURL ? message.guild.iconURL : "None"}\n`
                + `Channels            : ${message.guild.channels.size}\n`
                + `Members             : ${message.guild.members.size} (${message.guild.members.filter(m => !m.user.bot).size} Users | ${message.guild.members.filter(m => m.user.bot).size} Bots)\n`
                + `Roles               : ${message.guild.roles.size}\n`
                + `Emojis              : ${message.guild.emojis.size}\n`
                + `\`\`\``
            );
            let lengthen = client.functions.lengthen;
            if (after === "roles") return message.channel.sendMessage(
                `**__Roles for server:__** ${message.guild.name}\n`
                + `\`\`\`autohotkey\n`
                + message.guild.roles.filter(r => r.position !== 0).array().sort((a,b) => b.position - a.position).map(r => `=> ${lengthen(r.position, 2, "before")}: ${lengthen(r.name, 20)} (${r.id})`).join("\n")
                + `\`\`\``
            );
            if (after === "channels") return message.channel.sendMessage(
                `**__Text Channels for server:__** ${message.guild.name}\n`
                + `\`\`\`autohotkey\n`
                + message.guild.channels.filter(c => c.type === "text").array().sort((a,b) => a.position - b.position).map(c => `=> ${lengthen(c.position, 2, "before")}: ${lengthen(c.name, 20)} (${c.id})`).join("\n")
                + `\`\`\``
            );
            if (after === "bots") return message.channel.sendMessage(
                `**__Bots in server:__** ${message.guild.name}\n`
                + `\`\`\`autohotkey\n`
                + message.guild.members.filter(m => m.user.bot).map((b, i) => `=> ${lengthen(i + 1, 2, "before")}: ${lengthen(b.user.username, 20)} (${b.user.id})`).join("\n")
                + `\`\`\``
            );
        }
    },
    "userinfo": {
        mode: "lite",
        usage: {"command": "userinfo [@user]", "description": "Lists a user's information."},
        execute: (message, client) => {
            let user = message.mentions.users.array()[0];
            if (!user) user = message.author;
            let member = message.guild.member(user);
            message.channel.sendMessage(
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
    "bots": {
        usage: {"command": "bots [page]", "description": "Gives a list of bots from Carbonitex ranked by server count."},
        execute: (message, client) => {
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
                message.channel.sendMessage(`__\`Ranked Bot List - Provided by Carbonitex\`__\`\`\`autohotkey\nPage ${page + 1} / ${pages.length}\n\n${thisPage}\n\`\`\``);
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured making that request.`));
        }
    },
    "strawpoll": {
        usage: {"command": "strawpoll <question> <{choice1;choice2;etc}>", "description": "Create a strawpoll vote."},
        execute: (message, client) => {
            let match = /strawpoll\s+(.+)\s+{(.+)}/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let question = match[1];
            let choices = match[2];
            choices = choices.split(";");
            if (!choices.length > 1) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage. There must be between 2 and 30 choices.`);
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
            }, function(error, response, body) {
                if (error || response.statusCode !== 200) return message.channel.sendMessage(`${message.author} | \`❌\` | An error occured making that request.`);
                message.channel.sendMessage(`${message.author} | Your Strawpoll: <https://strawpoll.me/${JSON.parse(body).id}>`);
            });
        }
    }
};
