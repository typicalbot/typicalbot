module.exports = {
    "documentation": {
        dm: true,
        mode: "strict",
        aliases: ["docs"],
        usage: {"command": "donate", "description": "Donate to the cause of TypicalBot."},
        execute: (message, client, response) => {
            response.reply(`**Documentation can be found here:** <https://typicalbot.com/documentation/>`);
        }
    },
    "donate": {
        dm: true,
        mode: "strict",
        usage: {"command": "donate", "description": "Donate to the cause of TypicalBot."},
        execute: (message, client, response) => {
            response.reply(`**__You can donate here:__** ${client.config.urls.donate}\n\nDonations are GREATLY appreciated! They help cover extra costs for our server, domain, and other payments.`);
        }
    },
    "subscribe": {
        mode: "strict",
        aliases: ["sub"],
        usage: {"command": "subscribe", "description": "Subscribe to TypicalBot's announcements."},
        execute: (message, client, response) => {
            if (message.guild.id !== "163038706117115906") return response.error(`You must be in TypicalBot's Lounge inorder to use this command.`);
            let Role = message.guild.roles.find("name", "Subscriber");
            message.member.addRole(Role).then(() => {
                response.reply("You are now subscribed to TypicalBot's announcements!");
            });
        }
    },
    "unsubscribe": {
        mode: "strict",
        aliases: ["unsub"],
        usage: {"command": "subscribe", "description": "Unsubscribe from TypicalBot's announcements."},
        execute: (message, client, response) => {
            if (message.guild.id !== "163038706117115906") return response.error(`You must be in TypicalBot's Lounge inorder to use this command.`);
            let Role = message.guild.roles.find("name", "Subscriber");
            message.member.removeRole(Role).then(() => {
                response.reply("You are now unsubscribed from TypicalBot's announcements.");
            });
        }
    },
    "help": {
        dm: true,
        mode: "strict",
        usage: {"command": "help [command]", "description": "Get help with TypicalBot, or a specific command."},
        execute: (message, client, response) => {
            let cmd = message.content.split(" ")[1];
            if (!cmd) return response.send(`**Hello!** I'm TypicalBot, created by HyperCoder. You can get a list of my commands with \`$commands\`. Documentation can be found at <https://typicalbot.com/documentation/>. If you need help, join us in the TypicalBot Lounge at <${client.config.urls.server}>.`);

            let command = client.commandsManager.get(cmd);
            if (!command) return response.error(`Invalid command to get help with.`);
            response.send(
                `**__Usage For:__** ${cmd}\n`
                + `=> **[Param]** : Optional Parameter\n`
                + `=> **<Param>** : Required Parameter\n\n`
                + `\`\`\`\n`
                + `Command        : ${command.usage.command}\n`
                + `Aliases        : ${command.aliases ? command.aliases.join(", ") : "None"}\n`
                + `description    : ${command.usage.description}`
                + `\n\`\`\``
            );
        }
    },
    "info": {
        dm: true,
        mode: "strict",
        usage: {"command": "info", "description": "Get information about TypicalBot."},
        execute: (message, client, response) => {
            response.send(`**Hello!** I'm TypicalBot, created by HyperCoder. You can get a list of my commands with \`$commands\`. Documentation can be found at <https://typicalbot.com/documentation/>. If you need help, join us in the TypicalBot Lounge at <https://typicalbot.com/join-our-server/>.`);
        }
    },
    "commands": {
        dm: true,
        mode: "strict",
        aliases: ["cmds"],
        usage: {"command": "commands", "description": "Gives you a list of commands."},
        execute: (message, client, response) => {
            if (message.channel.type === "text") response.send(`Check your Direct Messages for my commands!`);

            let commands = client.commandsManager.commands;
            let list = Object.keys(commands);
            let level0 = list.filter(c => !commands[c].permission || commands[c].permission === 0 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level1 = list.filter(c => commands[c].permission && commands[c].permission === 1 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level2 = list.filter(c => commands[c].permission && commands[c].permission === 2 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level3 = list.filter(c => commands[c].permission && commands[c].permission === 3 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level4 = list.filter(c => commands[c].permission && commands[c].permission === 3 ? true : false).map(c => `${client.config.prefix}${c}`);

            response.dm(
                `**__TypicalBot's Commands:__**\nView Usage Here: ${client.config.urls.docs}\n\n`
                + `__**Permission Level 4:** Server Owner__\n${level4.join(", ")}\n\n`
                + `__**Permission Level 3:** Server Administrator__\n${level3.join(", ")}\n\n`
                + `__**Permission Level 2:** Server Moderator__\n${level2.join(", ")}\n\n`
                + `__**Permission Level 1:** Server DJ__\n${level1.join(", ")}\n\n`
                + `__**Permission Level 0:** Server Member__\n${level0.join(", ")}\n\n`
                + `__**Permission Level -1:** Server Blacklisted__\nNothing. You can't use any commands.`
            );
        }
    },
    "invite": {
        dm: true,
        mode: "strict",
        usage: {"command": "invite", "description": "Get TypicalBot's invite link."},
        execute: (message, client, response) => {
            response.reply(`You can invite me here: <${client.config.urls.oauth}>`);
        }
    },
    "server": {
        dm: true,
        mode: "strict",
        usage: {"command": "server", "description": "Get TypicalBot's server invite."},
        execute: (message, client, response) => {
            response.reply(`You can join my lounge here: <${client.config.urls.server}>`);
        }
    },
    "servers": {
        mode: "strict",
        usage: {"command": "servers <page>", "description": "Get a list of servers of the current shard."},
        execute: (message, client, response) => {
            let page = message.content.split(" ")[1];
            let lengthen = client.functions.lengthen;
            let paged = client.functions.pagify(
                client.guilds.array().sort((a,b) => b.memberCount - a.memberCount).map(g => `${lengthen(`${g.name.replace(/[^a-z0-9 '"/\\\[\]()-_!@#$%^&*]/gmi, "")}`, 30)} : ${g.memberCount}`),
                page
            );
            return response.reply(
                `**__Guilds on Shard ${+client.shardID + 1} / ${client.shardCount}:__**\n\`\`\`autohotkey\n${paged}\`\`\``
            );
        }
    },
    "stats": {
        dm: true,
        mode: "strict",
        usage: {"command": "stats", "description": "Get TypicalBot's current stats."},
        execute: (message, client, response) => {
            response.send(
                `**__TypicalBot's Statistics:__**\n`
                + `\`\`\`autohotkey\n`
                + `=> Uptime            : ${client.functions.uptime}\n`
                + `=> Servers           : ${client.data.guilds.toLocaleString()} (${client.shardCount} Shards)\n`
                + `=> Voice Connections : ${client.data.voiceConnections.toLocaleString()}\n`
                + `=> Library           : discord.js\n`
                + `=> Created By        : HyperCoder#2975\n`
                + `    This Shard:\n`
                + `=> Shard             : ${+client.shardNumber} / ${client.shardCount}\n`
                + `=> Servers           : ${client.guilds.size.toLocaleString()}\n`
                + `=> Channels          : ${client.channels.size.toLocaleString()}\n`
                + `=> Users             : ${client.users.size.toLocaleString()}\n`
                + `\`\`\``
            );
        }
    }
};
