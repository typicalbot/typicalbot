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
            let match = /(?:settings|set)\s+(view|edit)\s+([\w-]+)\s*(?:{(.+)})?\s*((?:.|[\r\n])+)?/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let action = match[1], setting = match[2], options = match[3] ? match[3].split(";") : [], value = match[4];
            if (action === "view") {
                if (setting === "masterrole") {

                } else if (setting === "joinrole") {

                } else {
                    message.channel.sendMessage(`${message.author} | \`❌\` | Invalid setting.`);
                }
            } else if (action === "edit") {
                if (!value) return message.channel.sendMessage(`${message.author} | \`❌\` | No value given to change the setting to.`);
                if (setting === "masterrole") {
                    if (value === "remove") {
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
                    if (value === "remove") {
                        client.settings.update(message.guild, "joinrole", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid role.`);
                        client.settings.update(message.guild, "joinrole", role.id).then(() => {
                            let announce = options.includes("showann");
                            client.settings.update(message.guild, "silent", announce ? "N" : "Y");
                            message.channel.sendMessage(`${message.author} | Success. ${announce ? "(This will send an announcement in your announcement channel.)" : ""}`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.\n\n${err}`));
                    }
                } else if (setting === "blacklistrole") {
                    if (value === "remove") {
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
                } else if (setting === "djrole") {
                    if (value === "remove") {
                        client.settings.update(message.guild, "djrole", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<@&([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let role = id ? message.guild.roles.get(id) : message.guild.roles.find("name", value);
                        if (!role) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid role.`);
                        client.settings.update(message.guild, "djrole", role.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "announcements") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "announcement", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "here") {
                        client.settings.update(message.guild, "announcement", message.channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        let match = /<#([0-9]+)>/i.exec(value);
                        let id = match ? match[1] : null;
                        let channel = id ? message.guild.channels.get(id) : message.guild.channels.find("name", value);
                        if (!channel) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid channel.`);
                        if (channel.type !== "text") return message.channel.sendMessage(`${message.author} | \`❌\` | The channel must be a text channel.`);
                        client.settings.update(message.guild, "announcement", channel.id).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "ann-join") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "joinann", "--disabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "joinann", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "joinann", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "ann-leave") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "leaveann", "--disabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "leaveann", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "leaveann", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "ann-ban") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "banann", "--disabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "default") {
                        client.settings.update(message.guild, "banann", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "banann", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "ann-unban") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "unbanann", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "enable") {
                        client.settings.update(message.guild, "unbanann", "--enabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "unbanann", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "ann-nick") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "nickann", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "enable" || value === "default") {
                        client.settings.update(message.guild, "nickann", "--enabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "nickann", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "ann-invite") {
                    if (value === "disable") {
                        client.settings.update(message.guild, "inviteann", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else if (value === "enable") {
                        client.settings.update(message.guild, "inviteann", "--enabled").then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "inviteann", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "joinmessage") {
                    if (value === "remove") {
                        client.settings.update(message.guild, "joinmessage", null).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    } else {
                        client.settings.update(message.guild, "joinmessage", value).then(() => {
                            message.channel.sendMessage(`${message.author} | Success.`);
                        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured.`));
                    }
                } else if (setting === "joinnick") {
                    if (value === "remove") {
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
                    if (value === "remove") {
                        client.settings.update(message.guild, "customprefix", null).then(() => {
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
            if (amount < 1) return message.channel.sendMessage(`${message.author} | \`❌\` | Please give a number above 0 and no greater than 100.`);
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
            let match = /kick\s+<@!?(.+)>/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let user = message.guild.members.get(match[1]);
            if (!user) return message.channel.sendMessage(`${message.author} | \`❌\` | User not found.`);
            if (!user.kickable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot kick that user.`);
            message.guild.member(user).kick().then(() => {
                message.channel.sendMessage(`${message.author} | Success.`);
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
            if (!user.bannable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot ban that user.`);
            message.guild.member(user).ban().then(() => {
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
            if (!user.bannable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot softban that user.`);
            message.guild.member(user).ban(parseInt(amount)).then(member => message.guild.unban(member).then(() => {
                message.channel.sendMessage(`${message.author} | Success. Purged ${amount} day${amount === 1 ? "" : "s"} worth of messages.`);
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`))
            ).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured:\n\n${err}`));
        }
    }
};
