module.exports = {
    "donate": {
        dm: true,
        usage: {"command": "donate", "description": "Donate to the cause of TypicalBot."},
        execute: (message, client) => {
            message.channel.sendMessage(`${message.author} | **__You can donate here:__** ${client.config.urls.donate}\n\nDonations are GREATLY appreciated! They help cover extra costs for our server, domain, and other payments.`);
        }
    },
    "subscribe": {
        aliases: ["sub"],
        usage: {"command": "subscribe", "description": "Subscribe to TypicalBot's announcements."},
        execute: (message, client) => {
            if (message.guild.id !== "163038706117115906") return message.channel.sendMessage(`${message.author} | \`❌\` | You must be in TypicalBot's Lounge inorder to use this command.`);
            let Role = message.guild.roles.find("name", "Subscriber");
            message.member.addRole(Role).then(() => {
                message.channel.sendMessage("You are now subscribed to TypicalBot's announcements!");
            });
        }
    },
    "unsubscribe": {
        aliases: ["unsub"],
        usage: {"command": "subscribe", "description": "Unsubscribe from TypicalBot's announcements."},
        execute: (message, client) => {
            if (message.guild.id !== "163038706117115906") return message.channel.sendMessage(`${message.author} | \`❌\` | You must be in TypicalBot's Lounge inorder to use this command.`);
            let Role = message.guild.roles.find("name", "Subscriber");
            message.member.removeRole(Role).then(() => {
                message.channel.sendMessage("You are now unsubscribed from TypicalBot's announcements.");
            });
        }
    },
    "help": {
        dm: true,
        usage: {"command": "help [command]", "description": "Get help with TypicalBot, or a specific command."},
        execute: (message, client) => {
            let cmd = message.content.split(" ")[1];
            if (!cmd) return message.channel.sendMessage(`**Hello!** I'm TypicalBot, created by HyperCoder. You can get a list of my commands with \`$commands\`. Documentation can be found at <https://typicalbot.com/documentation/>. If you need help, join us in the TypicalBot Lounge at <${client.config.urls.server}>.`);

            let command = client.commands.getCommand(cmd);
            if (!command) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command to get help with.`);
            message.channel.sendMessage(
                `${message.author} | **__Usage For:__** ${cmd}\n`
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
        usage: {"command": "info", "description": "Get information about TypicalBot."},
        execute: (message, client) => {
            message.channel.sendMessage(`**Hello!** I'm TypicalBot, created by HyperCoder. You can get a list of my commands with \`$commands\`. Documentation can be found at <https://typicalbot.com/documentation/>. If you need help, join us in the TypicalBot Lounge at <https://typicalbot.com/join-our-server/>.`);
        }
    },
    "commands": {
        dm: true,
        aliases: ["cmds"],
        usage: {"command": "commands", "description": "Gives you a list of commands."},
        execute: (message, client) => {
            if (message.channel.type === "text") message.channel.sendMessage(`${message.author} | Check your Direct Messages for my commands!`);

            let commands = client.commands.commands;
            let list = Object.keys(commands);
            let level0 = list.filter(c => !commands[c].permission || commands[c].permission === 0 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level1 = list.filter(c => commands[c].permission && commands[c].permission === 1 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level2 = list.filter(c => commands[c].permission && commands[c].permission === 2 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level3 = list.filter(c => commands[c].permission && commands[c].permission === 3 ? true : false).map(c => `${client.config.prefix}${c}`);
            let level4 = list.filter(c => commands[c].permission && commands[c].permission === 4 ? true : false).map(c => `${client.config.prefix}${c}`);

            message.author.sendMessage(
                `**__TypicalBot's Commands:__**\nView Usage Here: ${client.config.urls.docs}\n\n`
                + `__**Permission Level 4:** TypicalBot Staff__\n${level4.join(", ")}\n\n`
                + `__**Permission Level 3:** Server Owner__\n${level3.join(", ")}\n\n`
                + `__**Permission Level 2:** Server Admin__\n${level2.join(", ")}\n\n`
                + `__**Permission Level 1:** Server DJ__\n${level1.join(", ")}\n\n`
                + `__**Permission Level 0:** Server Member__\n${level0.join(", ")}\n\n`
                + `__**Permission Level -1:** Server Blacklisted__\nNothing. You can't use any commands.`
            );
        }
    },
    "invite": {
        dm: true,
        usage: {"command": "invite", "description": "Get TypicalBot's invite link."},
        execute: (message, client) => {
            message.channel.sendMessage(`${message.author} | You can invite me here: <${client.config.urls.oauth}>`);
        }
    },
    "server": {
        dm: true,
        usage: {"command": "server", "description": "Get TypicalBot's server invite."},
        execute: (message, client) => {
            message.channel.sendMessage(`${message.author} | You can join my lounge here: <${client.config.urls.server}>`);
        }
    },
    "stats": {
        dm: true,
        usage: {"command": "stats", "description": "Get TypicalBot's current stats."},
        execute: (message, client) => {
            message.channel.sendMessage(
                `**__TypicalBot's Statistics:__**\n`
                + `\`\`\``
                + `=> Uptime            : ${client.functions.uptime}\n`
                + `=> Servers           : ${client.data.guilds.toLocaleString()} (${client.ShardCount} Shards)\n`
                + `=> Voice Connections : ${client.data.voiceConnections.toLocaleString()}\n`
                + `\`\`\``
            );
        }
    },
    "shard": {
        usage: {"command": "shard", "description": "Get your current shard's stats."},
        execute: (message, client) => {
            message.channel.sendMessage(
                `**__Shard ${client.ShardID} | TypicalBot's Statistics:__**\n`
                + `\`\`\``
                + `=> Uptime            : ${client.functions.uptime}\n`
                + `=> Servers           : ${client.bot.guilds.size.toLocaleString()}\n`
                + `=> Voice Connections : ${client.bot.voiceConnections.size.toLocaleString()}\n`
                + `\`\`\``
            );
        }
    }
};
