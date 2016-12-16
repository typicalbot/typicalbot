module.exports = {
    "say": {
        mode: "strict",
        permission: 2,
        aliases: ["speak"],
        usage: {"command": "say <#channel> <message>", "description": "Have TypicalBot send a message in the same channel or the channel specified."},
        execute: (message, client) => {
            let match = /(?:say|speak)(?:\s+<#(.+)>)?\s+(.+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let channel = match[1] ? message.guild.channels.get(match[1]) : null;
            let text = match[2];
            if (channel) {
                if (!channel.permissionsFor(client.bot.user).hasPermission("SEND_MESSAGES")) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot send messages there.`);
                return channel.sendMessage(text);
            }
            message.channel.sendMessage(text);
            if (message.deletable) message.delete();
        }
    },
    "settings": {
        mode: "strict",
        permission: 2,
        aliases: ["set"],
        usage: {"command": "settings <'view'|'edit'> <setting> [{options}] <value>", "description": "Edit or view your server's settings."},
        execute: (message, client) => {
            let match = /(?:settings|set)\s+(view|edit)\s+([\w-]+)\s*((?:.|[\r\n])+)?/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage. You're most likely using the old syntax, which has changed. View the new syntax by using **$help set**.`);
            let action = match[1], setting = match[2], value = match[3];
            if (action === "view") {
                if (setting === "masterrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "masterrole");
                    message.channel.sendMessage(`**Master Role:** ${role ? role.name : "None"}`);
                } else if (setting === "joinrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "joinrole");
                    message.channel.sendMessage(`**Join Role:** ${role ? role.name : "None"}`);
                } else if (setting === "blacklistrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "blacklist");
                    message.channel.sendMessage(`**Blacklist Role:** ${role ? role.name : "None"}`);
                } else if (setting === "djrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "djrole");
                    message.channel.sendMessage(`**DJ Role:** ${role ? role.name : "None"}`);
                } else if (setting === "announcements") {
                    let channelid = message.guild.settings.announcements;
                    let channel = channelid ? message.guild.channels.get(channelid) || null : null;
                    message.channel.sendMessage(`**Server Announcements Channel:** ${channel ? `<#${channel.id}>` : "None"}`);
                } else if (setting === "logs") {
                    let channelid = message.guild.settings.logs;
                    let channel = channelid ? message.guild.channels.get(channelid) || null : null;
                    message.channel.sendMessage(`**Server Logs Channel:** ${channel ? `<#${channel.id}>` : "None"}`);
                } else if (setting === "logs-join") {
                    let msg = message.guild.settings.joinlog;
                    msg = !msg ? "Default Message:\n```\n**{user.name}** has joined the server.\n```" : msg === "--disabled" ? "Disabled" : msg.startsWith("--embed") ? `Embedded Object:\n\`\`\`\n${msg.slice(8)}\n\`\`\`` : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    message.channel.sendMessage(`**Join Log:** ${msg}`);
                } else if (setting === "logs-leave") {
                    let msg = message.guild.settings.leavelog;
                    msg = !msg ? "Default Message:\n```\n**{user.name}** has left the server.\n```" : msg === "--disabled" ? "Disabled" : msg.startsWith("--embed") ? `Embedded Object:\n\`\`\`\n${msg.slice(8)}\n\`\`\`` : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    message.channel.sendMessage(`**Leave Log:** ${msg}`);
                } else if (setting === "logs-ban") {
                    let msg = message.guild.settings.banlog;
                    msg = !msg ? "Default Message:\n```\n**{user.name}** has been banned from the server.\n```" : msg === "--disabled" ? "Disabled" : msg.startsWith("--embed") ? `Embedded Object:\n\`\`\`\n${msg.slice(8)}\n\`\`\`` : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    message.channel.sendMessage(`**Ban Log:** ${msg}`);
                } else if (setting === "logs-unban") {
                    let msg = message.guild.settings.unbanlog;
                    msg = !msg ? "Disabled" : msg === "--enabled" ? "Default Message:\n```\n**{user.name}** has been unbanned from the server.\n```" : msg.startsWith("--embed") ? `Embedded Object:\n\`\`\`\n${msg.slice(8)}\n\`\`\`` : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    message.channel.sendMessage(`**Unban Log:** ${msg}`);
                } else if (setting === "logs-nick") {
                    let msg = message.guild.settings.nicklog;
                    msg = !msg ? "Disabled" : msg === "--enabled" ? "Default Message:\n```\n**{user.name}** changed their nickname to **{user.nickname}**.\n```" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    message.channel.sendMessage(`**Nickname Log:** ${msg}`);
                } else if (setting === "logs-invite") {
                    let msg = message.guild.settings.invitelog;
                    msg = !msg ? "Disabled" : msg === "--enabled" ? "Default Message:\n```\n**{user.name}** has posted an invite in {channel}.\n```" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    message.channel.sendMessage(`**Invite Log:** ${msg}`);
                } else {
                    message.channel.sendMessage(`${message.author} | \`❌\` | Invalid setting.`);
                }
            } else if (action === "edit") {
                if (!value) return message.channel.sendMessage(`${message.author} | \`❌\` | No value given to change the setting to.`);
                if (setting === "masterrole") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "masterrole", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid role.`);
                        client.settings.update(message.guild, "masterrole", role.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "joinrole") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinrole", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid role.`);
                        client.settings.update(message.guild, "joinrole", role.id).then(() => {
                            let announce = value.startsWith("--showann");
                            if (announce) value = value.slice(10);
                            client.settings.update(message.guild, "silent", announce ? "N" : "Y");
                            message.channel.sendMessage(`${message.author} | Success. ${announce ? "(This will send an announcement in your announcement channel.)" : ""}`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.\n\n${err}`));
                    }
                } else if (setting === "blacklistrole") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "blacklist", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid role.`);
                        client.settings.update(message.guild, "blacklist", role.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "announcements") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "announcements", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "here") {
                        client.settings.update(message.guild, "announcements", message.channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<#([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let channel = id ? message.guild.channels.get(id) : message.guild.channels.find("name", value);
                        if (!channel) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid channel.`);
                        if (channel.type !== "text") return message.channel.sendMessage(`${message.author} | \`❌\` | The channel must be a text channel.`);
                        client.settings.update(message.guild, "announcements", channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "logs") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "logs", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "here") {
                        client.settings.update(message.guild, "logs", message.channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<#([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let channel = id ? message.guild.channels.get(id) : message.guild.channels.find("name", value);
                        if (!channel) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid channel.`);
                        if (channel.type !== "text") return message.channel.sendMessage(`${message.author} | \`❌\` | The channel must be a text channel.`);
                        client.settings.update(message.guild, "logs", channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "logs-join") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinlog", "--disabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "joinlog", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "embed") {
                        let msg = `--embed {"color": 65280, "author": { "name": "{user.name}#{user.discrim} ({user.id})", "icon_url": "{user.avatar}" }, "footer": { "text": "User joined" }, "timestamp": "{now}"}`;
                        client.settings.update(message.guild, "joinlog", msg).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let embed = value.startsWith("--embed");
                        if (embed) {
                            let object = value.slice(8);
                            try { object = JSON.parse(object); } catch(err) { return message.channel.sendMessage(`${message.author} | \`❌\` | Unable to convert into object.`); }
                        }
                        client.settings.update(message.guild, "joinlog", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "logs-leave") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "leavelog", "--disabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "leavelog", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "embed") {
                        let msg = `--embed {"color": 16737792, "author": { "name": "{user.name}#{user.discrim} ({user.id})", "icon_url": "{user.avatar}" }, "footer": { "text": "User left" }, "timestamp": "{now}"}`;
                        client.settings.update(message.guild, "leavelog", msg).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let embed = value.startsWith("--embed");
                        if (embed) {
                            let object = value.slice(8);
                            try { object = JSON.parse(object); } catch(err) { return message.channel.sendMessage(`${message.author} | \`❌\` | Unable to convert into object.`); }
                        }
                        client.settings.update(message.guild, "leavelog", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "logs-ban") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "banlog", "--disabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "banlog", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "embed") {
                        let msg = `--embed {"color": 16711680, "author": { "name": "{user.name}#{user.discrim} ({user.id})", "icon_url": "{user.avatar}" }, "footer": { "text": "User banned" }, "timestamp": "{now}"}`;
                        client.settings.update(message.guild, "banlog", msg).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let embed = value.startsWith("--embed");
                        if (embed) {
                            let object = value.slice(8);
                            try { object = JSON.parse(object); } catch(err) { return message.channel.sendMessage(`${message.author} | \`❌\` | Unable to convert into object.`); }
                        }
                        client.settings.update(message.guild, "banlog", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "logs-unban") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "unbanlog", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "enable" || value === "default") {
                        client.settings.update(message.guild, "unbanlog", "--enabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "embed") {
                        let msg = `--embed {"color": 3447003, "author": { "name": "{user.name}#{user.discrim} ({user.id})", "icon_url": "{user.avatar}" }, "footer": { "text": "User unbanned" }, "timestamp": "{now}"}`;
                        client.settings.update(message.guild, "unbanlog", msg).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let embed = value.startsWith("--embed");
                        if (embed) {
                            let object = value.slice(8);
                            try { object = JSON.parse(object); } catch(err) { return message.channel.sendMessage(`${message.author} | \`❌\` | Unable to convert into object.`); }
                        }
                        client.settings.update(message.guild, "unbanlog", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "logs-nick") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "nicklog", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "enable" || value === "default") {
                        client.settings.update(message.guild, "nicklog", "--enabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "nicklog", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "logs-invite") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "invitelog", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "enable" || value === "default") {
                        client.settings.update(message.guild, "invitelog", "--enabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "invitelog", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "joinmessage") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinmessage", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "joinmessage", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "joinnick") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinnick", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        if (value.length > 20) return message.channel.sendMessage(`${message.author} | \`❌\` | The join nickname must be no longer than 20 characters.`);
                        if (!value.includes("{user.name}")) return message.channel.sendMessage(`${message.author} | \`❌\` | The join nickname must include the replacer \`{user.name}\`.`);
                        client.settings.update(message.guild, "joinnick", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "mode") {
                    if (value === "free") {
                        client.settings.update(message.guild, "mode", "free").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "lite") {
                        client.settings.update(message.guild, "mode", "lite").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "strict") {
                        client.settings.update(message.guild, "mode", "strict").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        message.channel.sendMessage(`${message.author} | \`❌\` | Invalid option.`);
                    }
                } else if (setting === "customprefix" || setting === "prefix") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "customprefix", null).then(() => {
                            if (message.guild.settings.originaldisabled === "Y") client.settings.update(message.guild, "originaldisabled", "N");
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        if (value.length > 10) return message.channel.sendMessage(`${message.author} | \`❌\` | The custom prefix must be no longer than 10 characters.`);
                        client.settings.update(message.guild, "customprefix", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "defaultprefix") {
                    if (value === "enable") {
                        client.settings.update(message.guild, "originaldisabled", "N").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "disable") {
                        if (!message.guild.settings.customprefix) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot do that. A custom prefix must be set to turn the default prefix off.`);
                        client.settings.update(message.guild, "originaldisabled", "Y").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        message.channel.sendMessage(`${message.author} | \`❌\` | Invalid option.`);
                    }
                } else if (setting === "antiinvite") {
                    if (value === "enable") {
                        client.settings.update(message.guild, "antiinvite", "Y").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "disable") {
                        client.settings.update(message.guild, "antiinvite", "N").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        message.channel.sendMessage(`${message.author} | \`❌\` | Invalid option.`);
                    }
                } else if (setting === "modlogs") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "modlogs", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "here") {
                        client.settings.update(message.guild, "modlogs", message.channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<#([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let channel = id ? message.guild.channels.get(id) : message.guild.channels.find("name", value);
                        if (!channel) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid channel.`);
                        if (channel.type !== "text") return message.channel.sendMessage(`${message.author} | \`❌\` | The channel must be a text channel.`);
                        client.settings.update(message.guild, "modlogs", channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else {
                    message.channel.sendMessage(`${message.author} | \`❌\` | Invalid setting.`);
                }
            }
        }
    },
    "role": {
        mode: "strict",
        permission: 2,
        usage: {"command": "role <'give'/'take'> <@user> <role_name>", "description": "Give or take a role from a user."},
        execute: (message, client) => {
            let match = /role\s+(give|take)\s+<@!?([0-9]+)>\s+(.+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let action = match[1];
            let user = match[2];
            let role = match[3];

            let actualUser = message.guild.members.get(user);
            if (!actualUser) return message.channel.sendMessage(`${message.author} | \`❌\` | User not found.`);

            let actualRole = message.guild.roles.find("name", role);
            if (!actualRole) return message.channel.sendMessage(`${message.author} | \`❌\` | Role not found.`);

            if (!actualRole.editable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot manage that role.`);

            if (action === "give") {
                message.guild.member(actualUser).addRole(actualRole)
                    .then(() => message.channel.sendMessage(`${message.author} | Success.`))
                    .catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`));
            } else if (action === "take") {
                message.guild.member(actualUser).removeRole(actualRole)
                    .then(() => message.channel.sendMessage(`${message.author} | Success.`))
                    .catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`));
            }
        }
    },
    "prune": {
        mode: "strict",
        permission: 2,
        aliases: ["purge"],
        usage: {"command": "prune <number>", "description": "Prune messages in a channel."},
        execute: (message, client) => {
            if (
                !message.guild.member(client.bot.user).hasPermission("MANAGE_MESSAGES") &&
                !message.channel.permissionsFor(message.guild.member(client.bot.user)).hasPermission("MANAGE_MESSAGES")
            ) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot manage messages here.`);
            let amount = message.content.split(" ")[1];
            if (!amount) return message.channel.sendMessage(`${message.author} | \`❌\` | No number was given.`);
            if (amount <= 1) return message.channel.sendMessage(`${message.author} | \`❌\` | Please give a number above 1 and no greater than 100.`);
            if (amount > 100) amount = 100;
            message.channel.fetchMessages({limit: amount, before: message.id}).then(messages => {
                message.channel.bulkDelete(messages).then(() => {
                    message.delete();
                    message.channel.sendMessage(`${message.author} | Success.`).then(msg => msg.delete(5000).catch());
                }).catch(err => {
                    message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`);
                });
            }).catch(err => {
                message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`);
            });
        }
    },
    "kick": {
        mode: "strict",
        permission: 2,
        usage: {"command": "kick <@user>", "description": "Kick a user from the server."},
        execute: (message, client) => {
            let match = /kick\s+<@!?(.+)>(?:\s+(.+))?/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let user = message.guild.members.get(match[1]);
            if (!user) return message.channel.sendMessage(`${message.author} | \`❌\` | User not found.`);
            if (message.member.highestRole.position <= user.highestRole.position) return message.channel.sendMessage(`${message.author} | \`❌\` | You cannot kick a user with either the same or higher highest role.`);
            if (!user.kickable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot kick that user.`);
            message.guild.member(user).kick().then(() => {
                message.channel.sendMessage(`${message.author} | Success.`);
                if (message.guild.settings.modlogs) client.modlog.log(message.guild,
                    match[2] ? { action: "Kick", user: user.user, reason: match[2], moderator: message.author } : { action: "Kick", user: user.user }
                );
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`));
        }
    },
    "ban": {
        mode: "strict",
        permission: 2,
        usage: {"command": "ban <@user>", "description": "Ban a user from the server."},
        execute: (message, client) => {
            let match = /ban\s+<@!?(.+)>/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let user = message.guild.members.get(match[1]);
            if (!user) return message.channel.sendMessage(`${message.author} | \`❌\` | User not found.`);
            if (message.member.highestRole.position <= user.highestRole.position) return message.channel.sendMessage(`${message.author} | \`❌\` | You cannot ban a user with either the same or higher highest role.`);
            if (!user.bannable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot ban that user.`);
            message.guild.member(user).ban().then(() => {
                message.channel.sendMessage(`${message.author} | Success.`);
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`));
        }
    },
    "unban": {
        mode: "strict",
        permission: 2,
        usage: {"command": "unban <user_id", "description": "Unban a user from the server."},
        execute: (message, client) => {
            let match = /unban\s+(\d+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let user = match[1];
            if (!message.guild.member(client.bot.user).permissions.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage(`${message.author} | \`❌\` | I do not have permissions to unban users.`);
            message.guild.unban(user).then(() => {
                message.channel.sendMessage(`${message.author} | Success.`);
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`));
        }
    },
    "softban": {
        mode: "strict",
        permission: 2,
        usage: {"command": "softban <@user>", "description": "Softban a user from the server."},
        execute: (message, client) => {
            let match = /softban\s+<@!?(.+)>(?:\s+(\d))?/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let user = message.guild.members.get(match[1]);
            let amount = match[2] || 2;
            if (!user) return message.channel.sendMessage(`${message.author} | \`❌\` | User not found.`);
            if (message.member.highestRole.position <= user.highestRole.position) return message.channel.sendMessage(`${message.author} | \`❌\` | You cannot softban a user with either the same or higher highest role.`);
            if (!user.bannable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot softban that user.`);
            message.guild.member(user).ban(parseInt(amount)).then(member => message.guild.unban(member).then(() => {
                message.channel.sendMessage(`${message.author} | Success. Purged ${amount} day${amount === 1 ? "" : "s"} worth of messages.`);
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`))
            ).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`));
        }
    },
    "warn": {
        mode: "strict",
        permission: 2,
        usage: {"command": "warn <@user>", "description": "Warn a user in the server. (Only works with mod logs enabled)"},
        execute: (message, client) => {
            let match = /warn\s+<@!?(.+)>(?:\s+(.+))?/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let user = message.guild.members.get(match[1]);
            if (!user) return message.channel.sendMessage(`${message.author} | \`❌\` | User not found.`);
            if (message.member.highestRole.position <= user.highestRole.position) return message.channel.sendMessage(`${message.author} | \`❌\` | You cannot warn a user with either the same or higher highest role.`);
            if (message.guild.settings.modlogs) return client.modlog.log(message.guild,
                match[2] ? { action: "Warn", user: user.user, reason: match[2], moderator: message.author } : { action: "Warn", user: user.user }
            ).then(() => message.channel.sendMessage(`${message.author} | Success.`)).catch(err => message.reply(err));
            message.channel.sendMessage(`${message.author} | \`❌\` | Inorder to use the warning feature, you must have modlogs enabled.`);
        }
    },
    "reason": {
        mode: "strict",
        permission: 2,
        execute: (message, client) => {
            let match = /reason\s+(\w+)\s+(.+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let id = match[1], reason = match[2];
            if (!id) return message.channel.sendMessage(`${message.author} | \`❌\` | No ID given.`);
            if (!reason) return message.channel.sendMessage(`${message.author} | \`❌\` | No reason given.`);

            client.modlog.get(message.guild, id).then(log =>{
                if (!log) return message.channel.sendMessage(`${message.author} | \`❌\` | No log under the given ID.`);
                client.modlog.reason(log, message.author, reason).then(() => {
                    message.channel.sendMessage(`${message.author} | :thumbsup::skin-tone-2:`).then(msg => msg.delete(5000));
                }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured: ${err.stack}`));
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured: ${err.stack}`));
        }
    },
    "announce": {
        mode: "strict",
        permission: 5,
        usage: {"command": "announce <message>", "description": "Sends an announcement."},
        execute: (message, client) => {
            let has = message.content.split(" ")[1];
            if (!has) return message.channel.sendMessage(`${message.author} | \`❌\` | No message supplied.`);
            let text = message.content.slice(message.content.search(" ") + 1);

            let channel = message.guild.channels.get(message.guild.settings.announcements);
            if (!channel) return message.channel.sendMessage(`${message.author} | \`❌\` | No announcements channel set up.`);

            let useembed = text.startsWith("--embed");
            if (!useembed) return channel.sendMessage(`**__Announcement from ${message.author.username}#${message.author.discriminator}:__**\n\n${text}`);

            channel.sendMessage("", { embed: {
                "color": 0x00ADFF,
                "description": `**__Announcement:__**\n\n${text.slice(8)}`,
                "timestamp": new Date(),
                "footer": {
                    "text": `${message.author.username}#${message.author.discriminator}`,
                    "icon_url": message.author.avatarURL || null
                }
            }});
        }
    }
};
