const Discord = require("discord.js");

module.exports = {
    "say": {
        mode: "strict",
        permission: 2,
        aliases: ["speak"],
        usage: {"command": "say <#channel> <message>", "description": "Have TypicalBot send a message in the same channel or the channel specified."},
        execute: (message, client, response) => {
            let match = /(?:say|speak)(?:\s+<#(\d+)>)?\s+(.+)/i.exec(message.content);
            if (!match) return response.usage("say");

            let channel = message.guild.channels.get(match[1]);
            let content = match[2];

            channel ?
                channel.sendMessage(content).catch(err => response.error("Messages cannot be delivered there.")) :
                response.send(content);

            if (message.deletable) message.delete(500);
        }
    },
    "settings": {
        mode: "strict",
        permission: 3,
        aliases: ["set"],
        usage: {"command": "settings <'view'|'edit'> <setting> <value>", "description": "Edit or view your server's settings."},
        execute: (message, client, response) => {
            let match = /(?:settings|set)\s+(view|edit)\s+([\w-]+)\s*((?:.|[\r\n])+)?/i.exec(message.content);
            if (!match) return response.usage("settings");

            let action = match[1], setting = match[2], value = match[3];

            if (action === "view") {
                if (setting === "masterrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "masterrole");
                    response.send(`**Master Role:** ${role ? role.name : "None"}`);
                } else if (setting === "modrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "modrole");
                    response.send(`**Moderator Role:** ${role ? role.name : "None"}`);
                } else if (setting === "joinrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "joinrole");
                    response.send(`**Join Role:** ${role ? role.name : "None"}`);
                } else if (setting === "blacklistrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "blacklist");
                    response.send(`**Blacklist Role:** ${role ? role.name : "None"}`);
                } else if (setting === "djrole") {
                    let role = client.functions.fetchRole(message.guild, message.guild.settings, "djrole");
                    response.send(`**DJ Role:** ${role ? role.name : "None"}`);
                } else if (setting === "announcements") {
                    let channelid = message.guild.settings.announcements;
                    let channel = channelid ? message.guild.channels.get(channelid) || null : null;
                    response.send(`**Server Announcements Channel:** ${channel ? `<#${channel.id}>` : "None"}`);
                } else if (setting === "logs") {
                    let channelid = message.guild.settings.logs;
                    let channel = channelid ? message.guild.channels.get(channelid) || null : null;
                    response.send(`**Server Logs Channel:** ${channel ? `<#${channel.id}>` : "None"}`);
                } else if (setting === "logs-join") {
                    let msg = message.guild.settings.joinlog;
                    msg = !msg ? "Default Message:\n```\n**{user.name}** has joined the server.\n```" : msg === "--disabled" ? "Disabled" : msg.startsWith("--embed") ? "Embed Object" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    response.send(`**Join Log:** ${msg}`);
                } else if (setting === "logs-leave") {
                    let msg = message.guild.settings.leavelog;
                    msg = !msg ? "Default Message:\n```\n**{user.name}** has left the server.\n```" : msg === "--disabled" ? "Disabled" : msg.startsWith("--embed") ? "Embed Object" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    response.send(`**Leave Log:** ${msg}`);
                } else if (setting === "logs-ban") {
                    let msg = message.guild.settings.banlog;
                    msg = !msg ? "Default Message:\n```\n**{user.name}** has been banned from the server.\n```" : msg === "--disabled" ? "Disabled" : msg.startsWith("--embed") ? "Embed Object" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    response.send(`**Ban Log:** ${msg}`);
                } else if (setting === "logs-unban") {
                    let msg = message.guild.settings.unbanlog;
                    msg = !msg ? "Disabled" : msg === "--enabled" ? "Default Message:\n```\n**{user.name}** has been unbanned from the server.\n```" : msg.startsWith("--embed") ? "Embed Object" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    response.send(`**Unban Log:** ${msg}`);
                } else if (setting === "logs-nick") {
                    let msg = message.guild.settings.nicklog;
                    msg = !msg ? "Disabled" : msg === "--enabled" ? "Default Message:\n```\n**{user.name}** changed their nickname to **{user.nickname}**.\n```" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    response.send(`**Nickname Log:** ${msg}`);
                } else if (setting === "logs-invite") {
                    let msg = message.guild.settings.invitelog;
                    msg = !msg ? "Disabled" : msg === "--enabled" ? "Default Message:\n```\n**{user.name}** has posted an invite in {channel}.\n```" : `Custom Message:\n\`\`\`\n${msg}\n\`\`\``;
                    response.send(`**Invite Log:** ${msg}`);
                } else {
                    response.send(`${message.author} | \`❌\` | Invalid setting.`);
                }
            } else if (action === "edit") {
                if (!value) return response.error(`No value given to change the setting to.`);
                if (setting === "masterrole") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "masterrole", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return response.error(`Invalid role.`);
                        client.settings.update(message.guild, "masterrole", role.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "modrole") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "modrole", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return response.error(`Invalid role.`);
                        client.settings.update(message.guild, "modrole", role.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "joinrole") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinrole", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let announce = value.startsWith("--showann");
                        if (announce) value = value.slice(10);
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return response.error(`Invalid role.`);
                        client.settings.update(message.guild, "joinrole", role.id).then(() => {
                            client.settings.update(message.guild, "silent", announce ? "N" : "Y");
                            response.reply(`Success. ${announce ? "(This will send an announcement in your announcement channel.)" : ""}`);
                        }).catch(err => response.error(`An error occured.\n\n${err}`));
                    }
                } else if (setting === "blacklistrole") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "blacklist", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return response.error(`Invalid role.`);
                        client.settings.update(message.guild, "blacklist", role.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "announcements") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "announcements", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "here") {
                        client.settings.update(message.guild, "announcements", message.channel.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let match = /<#([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let channel = id ? message.guild.channels.get(id) : message.guild.channels.find("name", value);
                        if (!channel) return response.error(`Invalid channel.`);
                        if (channel.type !== "text") return response.error(`The channel must be a text channel.`);
                        client.settings.update(message.guild, "announcements", channel.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "ann-mention") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "annmention", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        let everyone = value === "everyone";
                        if (!role && !everyone) return response.error(`Invalid role.`);
                        client.settings.update(message.guild, "annmention", role ? role.id : "@all").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "logs") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "logs", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "here") {
                        client.settings.update(message.guild, "logs", message.channel.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let match = /<#([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let channel = id ? message.guild.channels.get(id) : message.guild.channels.find("name", value);
                        if (!channel) return response.error(`Invalid channel.`);
                        if (channel.type !== "text") return response.error(`The channel must be a text channel.`);
                        client.settings.update(message.guild, "logs", channel.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "logs-join") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinlog", "--disabled").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "joinlog", null).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "embed") {
                        client.settings.update(message.guild, "joinlog", "--embed").then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        client.settings.update(message.guild, "joinlog", value).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "logs-leave") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "leavelog", "--disabled").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "leavelog", null).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "embed") {
                        client.settings.update(message.guild, "leavelog", "--embed").then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        client.settings.update(message.guild, "leavelog", value).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "logs-ban") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "banlog", "--disabled").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "banlog", null).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "embed") {
                        client.settings.update(message.guild, "banlog", "--embed").then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        client.settings.update(message.guild, "banlog", value).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "logs-unban") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "unbanlog", null).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "enable" || value === "default") {
                        client.settings.update(message.guild, "unbanlog", "--enabled").then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "embed") {
                        client.settings.update(message.guild, "unbanlog", "--embed").then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        client.settings.update(message.guild, "unbanlog", value).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "logs-nick") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "nicklog", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "enable" || value === "default") {
                        client.settings.update(message.guild, "nicklog", "--enabled").then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        client.settings.update(message.guild, "nicklog", value).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "logs-invite") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "invitelog", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "enable" || value === "default") {
                        client.settings.update(message.guild, "invitelog", "--enabled").then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        client.settings.update(message.guild, "invitelog", value).then(() => {
                            response.reply(`Success.`).then(msg => {
                                if (message.guild.settings.logs) return;
                                response.error(`It seems that you don't have your logs channel set up! In order for this message to be used, you need to have the \`logs\` setting set up.`);
                            });
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "joinmessage") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinmessage", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        client.settings.update(message.guild, "joinmessage", value).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "joinnick") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinnick", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        if (value.length > 20) return response.error(`The join nickname must be no longer than 20 characters.`);
                        if (!value.includes("{user.name}")) return response.error(`The join nickname must include the replacer \`{user.name}\`.`);
                        client.settings.update(message.guild, "joinnick", value).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "mode") {
                    if (value === "free") {
                        client.settings.update(message.guild, "mode", "free").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "lite") {
                        client.settings.update(message.guild, "mode", "lite").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "strict") {
                        client.settings.update(message.guild, "mode", "strict").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        response.error(`Invalid option.`);
                    }
                } else if (setting === "customprefix" || setting === "prefix") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "customprefix", null).then(() => {
                            if (message.guild.settings.originaldisabled === "Y") client.settings.update(message.guild, "originaldisabled", "N");
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        if (value.length > 30) return response.error(`The custom prefix must be no longer than 30 characters.`);
                        client.settings.update(message.guild, "customprefix", value).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else if (setting === "defaultprefix") {
                    if (value === "enable") {
                        client.settings.update(message.guild, "originaldisabled", "N").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "disable") {
                        if (!message.guild.settings.customprefix) return response.error(`I cannot do that. A custom prefix must be set to turn the default prefix off.`);
                        client.settings.update(message.guild, "originaldisabled", "Y").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        response.error(`Invalid option.`);
                    }
                } else if (setting === "antiinvite") {
                    if (value === "enable") {
                        client.settings.update(message.guild, "antiinvite", "Y").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "disable") {
                        client.settings.update(message.guild, "antiinvite", "N").then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        response.error(`Invalid option.`);
                    }
                } else if (setting === "modlogs") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "modlogs", null).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (value === "here") {
                        client.settings.update(message.guild, "modlogs", message.channel.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else {
                        let match = /<#([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let channel = id ? message.guild.channels.get(id) : message.guild.channels.find("name", value);
                        if (!channel) return response.error(`Invalid channel.`);
                        if (channel.type !== "text") return response.error(`The channel must be a text channel.`);
                        client.settings.update(message.guild, "modlogs", channel.id).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                } else {
                    response.error(`Invalid setting.`);
                }
            }
        }
    },
    "roles": {
        mode: "strict",
        aliases: ["role"],
        usage: {"command": `Check \`roles help\` for more information.`, "description": "Manage or view roles in a server."},
        execute: (message, client, response, level) => {
            let match = /roles?\s+(help|list|give|take|public)(?:\s+(.+))?/i.exec(message.content);
            if (!match) return response.usage("roles");

            let action = match[1];
            let extra = match[2];

            if ((action === "give" || action === "take") && level < 3) return response.perms(3, level);
            let lengthen = client.functions.lengthen;

            if (action === "help") {
                return response.send(`**__Usage For:__** roles\n`
                + `=> **[Param]** : Optional Parameter\n`
                + `=> **<Param>** : Required Parameter\n\n`
                + `\`\`\`\n`
                + `roles list\nroles <'give'|'take'> <@user> <role-name>\nroles public <'list'|'clear'|'add'|'remove'> <role-name>\n\`\`\``);
            } else if (action === "list") {
                let page = message.content.split(" ")[2];

                let paged = client.functions.pagify(
                    message.guild.roles.filter(r => r.position !== 0).array().sort((a,b) => b.position - a.position).map(r => `${lengthen(r.name, 20)} : ${r.id}`),
                    page
                );

                return response.reply(
                    `**__Roles for server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
                );
            } else if (action === "give" || action === "take") {
                let input = /<@!?([0-9]{17,20})>\s+(.+)/i.exec(extra);
                if (!input) return response.error(`Invalid command usage. Check \`${client.config.prefix}roles help\` for more information.`);

                let iUser = input[1];
                let iRole = input[2];

                let aUser = message.guild.member(iUser);
                if (!aUser) return response.error(`Invalid user. Please make sure you're mentioning an actual user.`);

                let aRole = message.guild.roles.find("name", iRole);
                if (!aRole) return response.error(`Invalid role. Please make sure your spelling and capitalization is correct.`);

                if (!aRole.editable) return response.error(`Insignificant permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give or take and that I have the Manage Roles permission.`);

                if (action === "give") {
                    aUser.addRole(aRole)
                        .then(() => response.reply(`Success.`))
                        .catch(err => response.error(`An error occured:\n\n${err}`));
                } else {
                    aUser.removeRole(aRole)
                        .then(() => response.reply(`Success.`))
                        .catch(err => response.error(`An error occured:\n\n${err}`));
                }
            } else if (action === "public") {
                let input = /(list|add|remove|clear)(?:\s+(.+))?/i.exec(extra);
                if (!input) return response.error(`Invalid command usage. Check \`${client.config.prefix}roles help\` for more information.`);

                let aAction = input[1];
                let iRole = input[2];

                if (aAction === "list") {
                    let publicroles = message.guild.settings.publicroles;
                    let currentList = publicroles ? publicroles.split(";") : [];
                    if (!currentList.length) return response.reply(`There are no public roles set up for this server.`);

                    let list = currentList.filter(r => message.guild.roles.has(r)).map(r => message.guild.roles.get(r));
                    if (!list.length) return response.reply(`There are no public roles set up for this server.`);

                    let page = message.content.split(" ")[3];

                    let paged = client.functions.pagify(
                        list.filter(r => r.position !== 0).sort((a,b) => b.position - a.position).map(r => `${lengthen(r.name, 20)} : ${r.id}`),
                        page
                    );

                    return response.reply(
                        `**__Public roles for server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
                    );
                } else if (aAction === "clear") {
                    if (level < 3) return response.perms(3, level);

                    client.settings.update(message.guild, "publicroles", null).then(() => {
                        response.reply(`Success.`);
                    }).catch(err => response.error(`An error occured.`));
                } else {
                    if (level < 3) return response.perms(3, level);

                    let aRole = message.guild.roles.find("name", iRole);
                    if (!aRole) return response.error(`Invalid role. Please make sure your spelling and capitalization is correct.`);

                    if (aAction === "add") {
                        let publicroles = message.guild.settings.publicroles;
                        let currentList = publicroles ? publicroles.split(";") : [];

                        if (currentList.includes(aRole.id)) return response.error(`That role is already on the list of public roles.`);

                        currentList.push(aRole.id);

                        client.settings.update(message.guild, "publicroles", currentList.join(";")).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    } else if (aAction === "remove") {
                        let publicroles = message.guild.settings.publicroles;
                        let currentList = publicroles ? publicroles.split(";") : [];

                        let index = currentList.indexOf(aRole.id);
                        if (index < 0) return response.error(`That role isn't on the list of public roles.`);

                        currentList.splice(index, 1);

                        client.settings.update(message.guild, "publicroles", currentList.join(";")).then(() => {
                            response.reply(`Success.`);
                        }).catch(err => response.error(`An error occured.`));
                    }
                }
            }
        }
    },
    "give": {
        mode: "strict",
        usage: {"command": "give <role-name>", "description": "Give you a role off of the public roles list."},
        execute: (message, client, response) => {
            let match = /give\s+(.+)/i.exec(message.content);
            if (!match) return response.usage("give");

            let iRole = match[1];
            let aRole = message.guild.roles.find("name", iRole);

            if (!aRole) return response.error(`Invalid role. Please make sure your spelling and capitalization is correct and the role is on the public roles list.`);

            let publicroles = message.guild.settings.publicroles;
            let currentList = publicroles ? publicroles.split(";") : [];

            if (!currentList.includes(aRole.id)) return response.error(`You cannot give yourself that role. Please make sure the role you are trying to obtain is on the public roles list.`);

            if (!aRole.editable) return response.error(`Insignificant permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give and that I have the Manage Roles permission.`);

            message.member.addRole(aRole)
                .then(() => response.reply(`Success.`))
                .catch(err => response.error(`An error occured:\n\n${err}`));
        }
    },
    "take": {
        mode: "strict",
        usage: {"command": "take <role-name>", "description": "Take a role from you that is on the public roles list."},
        execute: (message, client, response) => {
            let match = /take\s+(.+)/i.exec(message.content);
            if (!match) return response.usage("take");

            let iRole = match[1];
            let aRole = message.guild.roles.find("name", iRole);

            if (!aRole) return response.error(`Invalid role. Please make sure your spelling and capitalization is correct and the role is on the public roles list.`);

            let publicroles = message.guild.settings.publicroles;
            let currentList = publicroles ? publicroles.split(";") : [];

            if (!currentList.includes(aRole.id)) return response.error(`You cannot take a role from yourself. Please make sure the role you are trying to remove is on the public roles list.`);

            if (!aRole.editable) return response.error(`Insignificant permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to take and that I have the Manage Roles permission.`);

            message.member.removeRole(aRole)
                .then(() => response.reply(`Success.`))
                .catch(err => response.error(`An error occured:\n\n${err}`));
        }
    },
    "purge": {
        mode: "strict",
        permission: 2,
        aliases: ["prune"],
        usage: {"command": "purge [@user|#channel] <amount>", "description": "Purge messages in a channel."},
        execute: (message, client, response) => {
            let match = /(?:purge|prune)(?:\s+<([#@]!?\d+)>)?\s+(\d+)/i.exec(message.content);
            if (!match) return response.usage("purge");

            let channel = match[1] && /#\d+/i.test(match[1]) ? message.guild.channels.get(match[1].slice(1)) : message.channel;
            let user = match[1] && /@!?\d+/i.test(match[1]) ? match[1].slice(match[1].substring(1, 2) === "!" ? 2 : 1) : null;
            let amount = match[2];
            if (amount <= 1) return response.error(`Provide a number from 1 to 100`);
            if (amount > 100) amount = 100;

            if (user) {
                return message.channel.fetchMessages({ limit: 100, before: message.id }).then(msgs => {
                    let list = msgs.filter(m => m.author.id === user).array().splice(0, amount);

                    if (list.filter(m => Date.now() - Discord.Snowflake.deconstruct(m.id).date.getTime() < 1209600000).length === 0) return response.error("No messages found to delete. If there are messages older than two weeks, I cannot delete them.");

                    message.channel.bulkDelete(list, true).then(msgs => {
                        response.reply(`Successfully deleted **${msgs.size}** message${msgs.size !== 1 ? "s" : ""}.`).then(msg => {
                            setTimeout(() => msg.delete(), 2500);
                        });
                        message.delete();
                    }).catch(err => response.error("An error occured. This most likely means I do not have permissions to manage messages."));
                }).catch(err => {
                    response.error(`An error occured. This most likely means I cannot read message history.`);
                });
            }

            if (channel) {
                return message.channel.fetchMessages({ limit: amount, before: message.id }).then(msgs => {
                    if (msgs.filter(m => Date.now() - Discord.Snowflake.deconstruct(m.id).date.getTime() < 1209600000).size === 0) return response.error("No messages found to delete. If there are messages older than two weeks, I cannot delete them.");

                    channel.bulkDelete(msgs, true).then(msgs => {
                        response.reply(`Successfully deleted **${msgs.size}** message${msgs.size !== 1 ? "s" : ""}.`).then(msg => {
                            setTimeout(() => msg.delete(), 2500);
                        });
                        message.delete();
                    }).catch(err => response.error(`An error occured. This most likely means I do not have permissions to manage messages.\n\n${err}`));
                }).catch(err => {
                    response.error(`An error occured. This most likely means I cannot read message history.`);
                });
            }
        }
    },
    "kick": {
        mode: "strict",
        permission: 2,
        usage: {"command": "kick <@user>", "description": "Kick a user from the server."},
        execute: (message, client, response) => {
            let match = /kick\s+<@!?(.+)>(?:\s+(.+))?/i.exec(message.content);
            if (!match) return response.usage("kick");

            let user = message.guild.members.get(match[1]);
            if (!user) return response.error(`User not found.`);

            if (message.member.highestRole.position <= user.highestRole.position) return response.error(`You cannot kick a user with either the same or higher highest role.`);
            if (!user.kickable) return response.error(`I cannot kick that user.`);

            message.guild.member(user).kick().then(() => {
                response.reply(`Success.`);
                if (message.guild.settings.modlogs) client.modlog.createLog(message.guild,
                    match[2] ? { action: "kick", user: user.user, reason: match[2], moderator: message.author } : { action: "kick", user: user.user, moderator: message.author }
                );
            }).catch(err => response.error(`An error occured:\n\n${err}`));
        }
    },
    "ban": {
        mode: "strict",
        permission: 2,
        usage: {"command": "ban <@user|user-id> [purge-days]", "description": "Ban a user from the server."},
        execute: (message, client, response) => {
            let match = /ban\s+(?:<@!?)?(\d+)>?(?:\s+(\d))?(?:\s+(.+))?/i.exec(message.content);
            if (!match) return response.usage("ban");
            let reason = match[3];

            client.fetchUser(match[1]).then(user => {
                let member = user ? message.guild.member(user) : null;

                if (member && message.member.highestRole.position <= member.highestRole.position) return response.error(`You cannot ban a user with either the same or higher highest role.`);
                if (member && !member.bannable) return response.error(`I cannot ban that user.`);

                let toban = user ? user : match[1];
                let purgeDays = match[2] || 0;

                client.banLogs.set(toban.id || toban, reason ? { moderator: message.author, reason } : { moderator: message.author });

                message.guild.ban(toban, purgeDays).then(() => {
                    response.reply(`Success.`);
                }).catch(err => {
                    if (err === "Error: Couldn't resolve the user ID to ban.") return response.error(`User cannot be resolved.`);
                    response.error(`An error occured.`);
                    client.banLogs.delete(toban.id || toban);
                });
            });
        }
    },
    "unban": {
        mode: "strict",
        permission: 2,
        usage: {"command": "unban <user-id>", "description": "Unban a user from the server."},
        execute: (message, client, response) => {
            let match = /unban\s+(\d+)(?:\s+(.+))?/i.exec(message.content);
            if (!match) return response.usage("unban");
            let reason = match[2];

            let user = match[1];
            if (!message.guild.member(client.user).permissions.hasPermission("BAN_MEMBERS")) return response.error(`I do not have permissions to unban users.`);

            client.unbanLogs.set(user, reason ? { moderator: message.author, reason } : { moderator: message.author });

            message.guild.unban(user).then(() => {
                response.reply(`Success.`);
            }).catch(err => {
                response.error(`An error occured. This most likely means the user you supplied isn't banned.`);
                client.unbanLogs.delete(user);
            });
        }
    },
    "softban": {
        mode: "strict",
        permission: 2,
        usage: {"command": "softban <@user> [purge-days]", "description": "Softban a user from the server."},
        execute: (message, client, response) => {
            let match = /softban\s+<@!?(.+)>(?:\s+(\d))?(?:\s+(.+))?/i.exec(message.content);
            if (!match) return response.usage("softban");
            let reason = match[3];

            let user = message.guild.members.get(match[1]);
            let amount = match[2] || 2;

            if (!user) return response.error(`User not found.`);
            if (message.member.highestRole.position <= user.highestRole.position) return response.error(`You cannot softban a user with either the same or higher highest role.`);
            if (!user.bannable) return response.error(`I cannot softban that user.`);

            client.softbans.set(user.id, setTimeout(() => client.softbans.delete(user.id), 2500));

            message.guild.member(user).ban(parseInt(amount)).then(member => {
                setTimeout(() => {
                    message.guild.unban(member).then(() => {
                        response.reply(`Success. Purged ${amount} day${amount === 1 ? "" : "s"} worth of messages.`);
                        if (message.guild.settings.modlogs) client.modlog.createLog(message.guild,
                            reason ?
                                { action: "softban", user: user.user, reason, moderator: message.author } :
                                { action: "softban", user: user.user, moderator: message.author }
                        );
                    }).catch(err => response.error(`An error occured:\n\n${err}`));
                },
                    1000
                );
            }).catch(err => response.error(`An error occured:\n\n${err}`));
        }
    },
    "warn": {
        mode: "strict",
        permission: 2,
        usage: {"command": "warn <@user>", "description": "Warn a user in the server. (Only works with mod logs enabled)"},
        execute: (message, client, response) => {
            let match = /warn\s+<@!?(.+)>(?:\s+(.+))?/i.exec(message.content);
            if (!match) return response.usage("warn");

            let user = message.guild.members.get(match[1]);
            if (!user) return response.error(`User not found.`);
            if (message.member.highestRole.position <= user.highestRole.position) return response.error(`You cannot warn a user with either the same or higher highest role.`);

            if (!message.guild.settings.modlogs) return response.error(`Inorder to use the warning feature, you must have modlogs enabled.`);

            client.modlog.createLog(message.guild,
                match[2] ? { action: "warn", user: user.user, reason: match[2], moderator: message.author } : { action: "warn", user: user.user }
            ).then(() => response.reply(`Success.`)).catch(err => response.error(err));
        }
    },
    "reason": {
        mode: "strict",
        permission: 2,
        usage: {"command": "reason <case-number|'latest'> <reason>", "description": "Gives a moderation log a reason."},
        execute: (message, client, response) => {
            let match = /reason\s+(\w+)\s+(.+)/i.exec(message.content);
            if (!match) return response.usage("reason");

            let id = match[1], reason = match[2];
            if (!id) return response.error(`No ID given.`);
            if (!reason) return response.error(`No reason given.`);

            client.modlog.fetchCase(message.guild, id).then(log =>{
                if (!log) return response.error(`No log under the given ID.`);

                client.modlog.editReason(log, message.author, reason).then(() => {
                    response.reply(`:thumbsup::skin-tone-2:`).then(msg => msg.delete(5000));
                }).catch(err => response.error(`An error occured.`));
            }).catch(err => response.error(`An error occured.`));
        }
    },
    "announce": {
        mode: "strict",
        permission: 3,
        usage: {"command": "announce <message>", "description": "Sends an announcement."},
        execute: (message, client, response) => {
            let has = message.content.split(" ")[1];
            if (!has) return response.error(`No message supplied.`);
            let text = message.content.slice(message.content.search(" ") + 1);

            let channel = message.guild.channels.get(message.guild.settings.announcements);
            if (!channel) return response.error(`No announcements channel set up.`);

            let useembed = text.startsWith("--embed");
            if (!useembed) return channel.sendMessage(`**__Announcement from ${message.author.username}#${message.author.discriminator}:__**\n\n${text}`);
            text = text.slice(8);

            let mention = text.startsWith("--mention");
            if (mention) text = text.slice(10);
            let annmention = message.guild.settings.annmention;
            let mentionrole = annmention === "@all" ? "@everyone" : message.guild.roles.get(annmention);

            if (mention && !mentionrole) return response.error(`Announcing with a mention requires the \`ann-mention\` setting to be set.`);

            channel.sendMessage(mention && mentionrole ? `${mentionrole}` : "", { embed: {
                "color": 0x00ADFF,
                "description": `**__Announcement:__**\n\n${text}`,
                "timestamp": new Date(),
                "footer": {
                    "text": `${message.author.username}#${message.author.discriminator}`,
                    "icon_url": message.author.avatarURL || null
                }
            }});
        }
    }
};
