const Command = require("../../structures/Command");

const settingsList = {
    "embed": "Embed responses from TypicalBot.",
    "adminrole": "Administrator role that will grant users with this role permission level 3.",
    "modrole": "Moderator role that will grant users with this role permission level 2.",
    "blacklistrole": "Users with this role will be denied access to any of TypicalBot's commands.",
    "autorole": "Users joining the server will automatically be given this role.",
    "autoroledelay": "The amount of time to wait before giving the autorole to allow for security levels to work.",
    "autorolesilent": "if not silent, a message will be sent in the logs channel stating a user was given the autorole.",
    "announcements": "A channel for announcements to be posted, used with the `announce` command.",
    "announcements-mention": "A mention to be put in the announcement when posted, such as a Subscriber role.",
    "logs": "A channel for activity logs to be posted.",
    "logs-join": "A custom set message to be posted when a user joins the server.",
    "logs-leave": "A custom set message to be posted when a user leaves the server.",
    "logs-ban": "A custom set message to be posted when a user is banned from the server.",
    "logs-unban": "A custom set message to be posted when a user is unbanned from the server.",
    "logs-nickname": "A custom set message to be posted when a user changes their nickname in the server.",
    "logs-invite": "A custom set message to be posted when a user posts an invite in the server.",
    "automessage": "A message to be sent to a user when they join the server.",
    "autonickname": "A nickname to give a user when they join the server.",
    "mode": "A mode to enable certain commands.",
    "customprefix": "A custom prefix to user other than `$`.",
    "defaultprefix": "The default prefix `$`.",
    "antiinvite": "Server moderation tool to delete any invites sent by users in the server.",
    "antiinvite-kick": "Auto-Kick users who send multiple invites in the server in a certain time span.",
    "modlogs": "A channel to send moderation logs in. Aka audit logs.",
    "nonickname": "A way to disable the `nickname` command from being used.",
};

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "settings",
            description: "Customize your servers setting and enable/discord specific features.",
            usage: "settings <'list'|'view'|'edit'> [setting] ['add'|'remove'] [value]",
            aliases: ["set"],
            mode: "strict"
        });
    }

    execute(message, response, permissionLevel) {
        const args = /(?:settings|set)\s+(list|view|edit)(?:\s+([\w-]+)\s*(?:(add|remove)\s+)?((?:.|[\r\n])+)?)?/i.exec(message.content);
        if (!args) return response.usage(this);

        const actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);

        const action = args[1], setting = args[2], ar = args[3], value = args[4];

        if (action === "edit" && actualUserPermissions.level < 2) return response.perms({ permission: 2 }, actualUserPermissions);

        if (action === "list") {
            let page = setting || 1;
            const settings = Object.keys(settingsList);
            const count = Math.ceil(settings.length / 10);
            if (page < 1 || page > count) page = 1;

            const list = settings.splice((page -1) * 10, 10).map(k => ` • **${k}:** ${settingsList[k]}`);

            response.send(`**__Available settings to use with TypicalBot:__**\n\n**Page ${page} / ${count}**\n${list.join("\n")}`);
        } else if (action === "view") {
            if (setting) {
                if (setting === "embed") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.embed ? "Enabled" : "Disabled"}`);
                } else if (setting === "adminrole") {
                    const rawList = message.guild.settings.roles.administrator;
                    const list = rawList.filter(r => message.guild.roles.has(r)).map(r => `*${message.guild.roles.get(r).name}*`);

                    if (!list.length) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${list.join(", ")}`);
                } else if (setting === "modrole") {
                    const rawList = message.guild.settings.roles.moderator;
                    const list = rawList.filter(r => message.guild.roles.has(r)).map(r => `*${message.guild.roles.get(r).name}*`);

                    if (!list.length) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${list.join(", ")}`);
                } else if (setting === "djrole") {
                    const rawList = message.guild.settings.roles.dj;
                    const list = rawList.filter(r => message.guild.roles.has(r)).map(r => `*${message.guild.roles.get(r).name}*`);

                    if (!list.length) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${list.join(", ")}`);
                } else if (setting === "blacklistrole") {
                    const rawList = message.guild.settings.roles.blacklist;
                    const list = rawList.filter(r => message.guild.roles.has(r)).map(r => `*${message.guild.roles.get(r).name}*`);

                    if (!list.length) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${list.join(", ")}`);
                } else if (setting === "autorole") {
                    const role = message.guild.roles.get(message.guild.settings.auto.role.id);

                    if (!role) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${role.name}`);
                } else if (setting === "autoroledelay") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.auto.role.delay ? `${message.guild.settings.auto.role.delay}ms` : "Default"}`);
                } else if (setting === "autorolesilent") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.auto.role.silent ? "Enabled" : "Disabled"}`);
                } else if (setting === "announcements") {
                    const channel = message.guild.channels.get(message.guild.settings.announcements.id);

                    if (!channel) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${channel.toString()}`);
                } else if (setting === "announcements-mention" || setting === "ann-mention") {
                    const role = message.guild.roles.get(message.guild.settings.announcements.mention);

                    if (!role) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${role.name}`);
                } else if (setting === "logs") {
                    const channel = message.guild.channels.get(message.guild.settings.logs.id);

                    if (!channel) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${channel.toString()}`);
                } else if (setting === "logs-join") {
                    const log = message.guild.settings.logs.join;
                    const disabled = log === "--disabled", embed = log === "--embed";
                    const logText = !log ? "Default" : disabled ? "Disabled" : embed ? "Embed" : `\`\`\`txt\n${log}\n\`\`\``;

                    response.reply(`**__Current Value:__** ${logText}`);
                } else if (setting === "logs-leave") {
                    const log = message.guild.settings.logs.leave;
                    const disabled = log === "--disabled", embed = log === "--embed";
                    const logText = !log ? "Default" : disabled ? "Disabled" : embed ? "Embed" : `\`\`\`txt\n${log}\n\`\`\``;

                    response.reply(`**__Current Value:__** ${logText}`);
                } else if (setting === "logs-ban") {
                    const log = message.guild.settings.logs.ban;
                    const disabled = log === "--disabled", embed = log === "--embed";
                    const logText = !log ? "Default" : disabled ? "Disabled" : embed ? "Embed" : `\`\`\`txt\n${log}\n\`\`\``;

                    response.reply(`**__Current Value:__** ${logText}`);
                } else if (setting === "logs-unban") {
                    const log = message.guild.settings.logs.unban;
                    const disabled = log === "--disabled", embed = log === "--embed";
                    const logText = !log ? "Default" : disabled ? "Disabled" : embed ? "Embed" : `\`\`\`txt\n${log}\n\`\`\``;

                    response.reply(`**__Current Value:__** ${logText}`);
                } else if (setting === "logs-nickname") {
                    const log = message.guild.settings.logs.nickname;
                    const enabled = log === "--enabled";
                    const logText = enabled ? "Default" : !log ? "Disabled" : `\`\`\`txt\n${log}\n\`\`\``;

                    response.reply(`**__Current Value:__** ${logText}`);
                } else if (setting === "logs-invite") {
                    const log = message.guild.settings.logs.invite;
                    const enabled = log === "--enabled";
                    const logText = enabled ? "Default" : !log ? "Disabled" : `\`\`\`txt\n${log}\n\`\`\``;

                    response.reply(`**__Current Value:__** ${logText}`);
                } else if (setting === "modlogs" || setting === "logs-moderation") {
                    const channel = message.guild.channels.get(message.guild.settings.logs.moderation);

                    if (!channel) return response.reply(`**__Current Value:__** None`);
                    response.reply(`**__Current Value:__** ${channel.toString()}`);
                } else if (setting === "automessage") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.auto.message ? `\`\`\`txt\n${message.guild.settings.auto.message}\n\`\`\`` : "None"}`);
                } else if (setting === "autonickname") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.auto.nickname ? `\`\`\`txt\n${message.guild.settings.auto.nickname}\n\`\`\`` : "None"}`);
                } else if (setting === "mode") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.mode}`);
                } else if (setting === "customprefix") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.prefix.custom ? message.guild.settings.prefix.custom : "None"}`);
                } else if (setting === "defaultprefix") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.prefix.default ? "Enabled" : "Disabled"}`);
                } else if (setting === "antiinvite") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.automod.invite ? "Enabled" : "Disabled"}`);
                } else if (setting === "nonickname") {
                    response.reply(`**__Current Value:__** ${message.guild.settings.nonickname ? "Enabled" : "Disabled"}`);
                } else {
                    response.error("The requested setting doesn't exist");
                }
            } else {
                response.send(`**__Currently Set Settings:__**\n\n`);
            }
        } else if (action === "edit") {
            if (setting && value) {
                if (setting === "embed") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { embed: false }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { embed: true }).then(() => response.success("Setting successfully updated."));
                    } else {
                        response.error("An invalid option was given.");
                    }
                } else if (setting === "adminrole") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { administrator: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error("The specified role is already included in the list of roles for the administrator permission level.");

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, { roles: { administrator: currentList } }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error("The specified role is not included in of list of roles for the administrator permission level.");

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, { roles: { administrator: currentList } }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                            const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                            if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                            this.client.settingsManager.update(message.guild.id, { roles: { administrator: [ role.id ] } }).then(() => response.success("Setting successfully updated."));
                        }
                    }
                } else if (setting === "modrole") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { moderator: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error("The specified role is already included in the list of roles for the administrator permission level.");

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: { moderator: currentList } }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error("The specified role is not included in of list of roles for the administrator permission level.");

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, { roles: { moderator: currentList } }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                            const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                            if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                            this.client.settingsManager.update(message.guild.id, { roles: { moderator: [ role.id ] } }).then(() => response.success("Setting successfully updated."));
                        }
                    }
                } else if (setting === "djrole") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { dj: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error("The specified role is already included in the list of roles for the administrator permission level.");

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, { roles: { dj: currentList } }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error("The specified role is not included in of list of roles for the administrator permission level.");

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, { roles: { dj: currentList } }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                            const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                            if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                            this.client.settingsManager.update(message.guild.id, { roles: { dj: [ role.id ] } }).then(() => response.success("Setting successfully updated."));
                        }
                    }
                } else if (setting === "blacklistrole") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { blacklist: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error("The specified role is already included in the list of roles for the administrator permission level.");

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, { roles: { blacklist: currentList } }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error("The specified role is not included in of list of roles for the administrator permission level.");

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, { roles: { blacklist: currentList } }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                            const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                            if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                            this.client.settingsManager.update(message.guild.id, { roles: { blacklist: [ role.id ] } }).then(() => response.success("Setting successfully updated."));
                        }
                    }
                } else if (setting === "autorole") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { auto: { role: { id: null } }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                        const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                        if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                        this.client.settingsManager.update(message.guild.id, { auto: { role: { id: role.id } } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "autoroledelay") {
                    if (value === "disable" || value === "default") {
                        this.client.settingsManager.update(message.guild.id, { auto: { role: { delay: null } }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        const subArgs = /^(\d+)$/i.exec(value);
                        if (!subArgs || subArgs[1] > 600000 || subArgs[1] < 2000) return response.error("An invalid time was given. Try again with a time, in milliseconds, from 2000ms (2s) to 600000ms (10 min).");

                        this.client.settingsManager.update(message.guild.id, { auto: { role: { delay: subArgs[1] } } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "autorolesilent") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { auto: { role: { silent: false } } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { auto: { role: { silent: true } } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        response.error("An invalid option was given.");
                    }
                } else if (setting === "announcements") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { announcements: { id: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "here") {
                        this.client.settingsManager.update(message.guild.id, { announcements: { id: message.channel.id } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        const subArgs = /(?:(?:<#)?(\d{17,20})>?|(.+))/i.exec(value);

                        const channel = subArgs[1] ? message.guild.channels.get(subArgs[1]) : message.guild.channels.find(c => c.name.toLowerCase() === subArgs[2].toLowerCase());
                        if (!channel) return response.error("Invalid channel. Please make sure your spelling is correct, and that the channel actually exists.");

                        this.client.settingsManager.update(message.guild.id, { announcements: { id: channel.id } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "announcements-mention" || setting === "ann-mention") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { announcements: { mention: null } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                        const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                        if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                        this.client.settingsManager.update(message.guild.id, { announcements: { mention: role.id } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "logs") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { id: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "here") {
                        this.client.settingsManager.update(message.guild.id, { logs: { id: message.channel.id } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        const subArgs = /(?:(?:<#)?(\d{17,20})>?|(.+))/i.exec(value);

                        const channel = subArgs[1] ? message.guild.channels.get(subArgs[1]) : message.guild.channels.find(c => c.name.toLowerCase() === subArgs[2].toLowerCase());
                        if (!channel) return response.error("Invalid channel. Please make sure your spelling is correct, and that the channel actually exists.");

                        this.client.settingsManager.update(message.guild.id, { logs: { id: channel.id } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "logs-join") {
                    if (!message.guild.settings.logs.id) return response.error("You must have a logs channel set up before changing this setting.");

                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { join: "--disabled" } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "default" || value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { join: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "embed") {
                        this.client.settingsManager.update(message.guild.id, { logs: { join: "--embed" } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        this.client.settingsManager.update(message.guild.id, { logs: { join: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "logs-leave") {
                    if (!message.guild.settings.logs.id) return response.error("You must have a logs channel set up before changing this setting.");

                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { leave: "--disabled" } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "default" || value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { leave: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "embed") {
                        this.client.settingsManager.update(message.guild.id, { logs: { leave: "--embed" } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        this.client.settingsManager.update(message.guild.id, { logs: { leave: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "logs-ban") {
                    if (!message.guild.settings.logs.id) return response.error("You must have a logs channel set up before changing this setting.");

                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { ban: "--disabled" } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "default" || value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { ban: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "embed") {
                        this.client.settingsManager.update(message.guild.id, { logs: { ban: "--embed" } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        this.client.settingsManager.update(message.guild.id, { logs: { ban: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "logs-unban") {
                    if (!message.guild.settings.logs.id) return response.error("You must have a logs channel set up before changing this setting.");

                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { unban: "--disabled" } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "default" || value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { unban: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "embed") {
                        this.client.settingsManager.update(message.guild.id, { logs: { unban: "--embed" } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        this.client.settingsManager.update(message.guild.id, { logs: { unban: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "logs-nickname") {
                    if (!message.guild.settings.logs.id) return response.error("You must have a logs channel set up before changing this setting.");

                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { nickname: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "default" || value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { nickname: "--enabled" } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "embed") {
                        response.error("This log option does not support embeds.");
                    } else {
                        this.client.settingsManager.update(message.guild.id, { logs: { nickname: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "logs-invite") {
                    if (!message.guild.settings.logs.id) return response.error("You must have a logs channel set up before changing this setting.");

                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { invite: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "default" || value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { invite: "--enabled" } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "embed") {
                        response.error("This log option does not support embeds.");
                    } else {
                        this.client.settingsManager.update(message.guild.id, { logs: { invite: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "modlogs" || setting === "logs-moderation") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { logs: { moderation: null } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "here") {
                        this.client.settingsManager.update(message.guild.id, { logs: { moderation: message.channel.id } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        const subArgs = /(?:(?:<#)?(\d{17,20})>?|(.+))/i.exec(value);

                        const channel = subArgs[1] ? message.guild.channels.get(subArgs[1]) : message.guild.channels.find(c => c.name.toLowerCase() === subArgs[2].toLowerCase());
                        if (!channel) return response.error("Invalid channel. Please make sure your spelling is correct, and that the channel actually exists.");

                        this.client.settingsManager.update(message.guild.id, { logs: { moderation: channel.id } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "automessage") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { auto: { message: null } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        this.client.settingsManager.update(message.guild.id, { auto: { message: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "autonickname") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { auto: { message: null } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (value.length > 20) return response.error("Autonickname must contain no more than 20 characters.");
                        if (!value.includes("{user.name}")) return response.error("Autonickname must contain the `{user.name}` placeholder.");

                        this.client.settingsManager.update(message.guild.id, { auto: { message: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "mode") {
                    if (value === "free") {
                        this.client.settingsManager.update(message.guild.id, { mode: "free" }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "lite") {
                        this.client.settingsManager.update(message.guild.id, { mode: "free" }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "strict") {
                        this.client.settingsManager.update(message.guild.id, { mode: "strict" }).then(() => response.success("Setting successfully updated."));
                    } else {
                        response.error("Mode must be either `free`, `lite`, or `strict`.");
                    }
                } else if (setting === "customprefix") {
                    if (value === "disable") {
                        if (!message.guild.settings.prefix.default) this.client.settingsManager.update(message.guild.id, { prefix: { default: true } });

                        this.client.settingsManager.update(message.guild.id, { prefix: { custom: null } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (value.length > 5) return response.error("Your custom prefix must contain no more than 5 characters.");

                        this.client.settingsManager.update(message.guild.id, { prefix: { custom: value } }).then(() => response.success("Setting successfully updated."));
                    }
                } else if (setting === "defaultprefix") {
                    if (value === "disable") {
                        if (!message.guild.settings.prefix.custom) return response.error("You must have a custom prefix set up to disable this.");

                        this.client.settingsManager.update(message.guild.id, { prefix: { default: false } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { prefix: { default: true } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        response.error("An invalid option was given.");
                    }
                } else if (setting === "antiinvite") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { automod: { invite: false } }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { automod: { invite: true } }).then(() => response.success("Setting successfully updated."));
                    } else {
                        response.error("An invalid option was given.");
                    }
                } else if (setting === "nonickname") {
                    if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, { nonickname: false }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "enable") {
                        this.client.settingsManager.update(message.guild.id, { nonickname: false }).then(() => response.success("Setting successfully updated."));
                    } else {
                        response.error("An invalid option was given.");
                    }
                } else {
                    response.error("The requested setting doesn't exist");
                }
            } else return response.usage(this);
        }
    }

    NOembedExecute(message, response, permissionLevel) {
        const args = /(?:settings|set)\s+(list|view|edit)(?:\s+([\w-]+)\s*(?:(add|remove)\s+)?((?:.|[\r\n])+)?)?/i.exec(message.content);
        if (!args) return response.usage(this);

        const realPermissionLevel = this.client.permissionsManager.get(message.guild, message.author, true);

        const action = args[1], setting = args[2], ar = args[3], value = args[4];

        if (action === "edit" && realPermissionLevel.level < 2) return response.perms({ permission: 2 }, realPermissionLevel);

        if (action === "list") {
            let page = setting || 1;
            const settings = Object.keys(settingsList);
            const count = Math.ceil(settings.length / 10);
            if (page < 1 || page > count) page = 1;

            const list = settings.splice((page -1) * 10, 10);

            const embed = response.buildEmbed()
                .setColor(0x00ADFF)
                .setTitle(`TypicalBot Settings | Page ${page} / ${count}`)
                .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                .setTimestamp();

            list.forEach(k => embed.addField(`» ${k}`, settingsList[k]));

            embed.send();
        } else if (action === "view") {
            if (setting) {
                if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                }
            } else {
                const embed = response.buildEmbed()
                    .setColor(0x00ADFF)
                    .setTitle(`Currently Set Settings`)
                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                    .setTimestamp();

                embed.send();
            }
        } else if (action === "edit") {
            if (setting && value) {
                if (setting === "embed") {
                    if (value === "enable") {
                        this.client.settingsManager.update(message.guild.id, {
                            embed: true
                        }).then(() => response.buildEmbed().setColor(0x00ADFF)
                            .setTitle("Success")
                            .setDescription("Setting successfully updated.")
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send()
                        );
                    } else if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, {
                            embed: false
                        }).then(() => response.buildEmbed().setColor(0x00ADFF)
                            .setTitle("Success")
                            .setDescription("Setting successfully updated.")
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send()
                        );
                    } else {
                        response.buildEmbed()
                            .setColor(0xFF0000)
                            .setTitle("Error")
                            .setDescription(`An invalid option was given.`)
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send();
                    }
                } else if (setting === "adminrole") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { administrator: [] }}).then(() => response.buildEmbed().setColor(0x00ADFF)
                            .setTitle("Success")
                            .setDescription("Setting successfully updated.")
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send()
                        );
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is already included in the list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        administrator: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is not included in of list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        administrator: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            }
                        } else {
                            const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                            const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                            if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    administrator: [ role.id ]
                                }
                            }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                .setTitle("Success")
                                .setDescription("Setting successfully updated.")
                                .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                .setTimestamp()
                                .send()
                            );
                        }
                    }
                } else if (setting === "modrole" || setting === "2") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { moderator: [] }}).then(() => response.buildEmbed().setColor(0x00ADFF)
                            .setTitle("Success")
                            .setDescription("Setting successfully updated.")
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send()
                        );
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is already included in the list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        moderator: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is not included in of list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        moderator: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            }
                        } else {
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The role you specified does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    moderator: [ role.id ]
                                }
                            }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                .setTitle("Success")
                                .setDescription("Setting successfully updated.")
                                .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                .setTimestamp()
                                .send()
                            );
                        }
                    }
                } else if (setting === "djrole" || setting === "1") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { dj: [] }}).then(() => response.buildEmbed().setColor(0x00ADFF)
                            .setTitle("Success")
                            .setDescription("Setting successfully updated.")
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send()
                        );
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is already included in the list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        dj: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is not included in of list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        dj: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            }
                        } else {
                            const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                            const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                            if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    dj: [ role.id ]
                                }
                            }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                .setTitle("Success")
                                .setDescription("Setting successfully updated.")
                                .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                .setTimestamp()
                                .send()
                            );
                        }
                    }
                } else if (setting === "blacklistrole" || setting === "-1") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { blacklist: [] }}).then(() => response.buildEmbed().setColor(0x00ADFF)
                            .setTitle("Success")
                            .setDescription("Setting successfully updated.")
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send()
                        );
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is already included in the list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        blacklist: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            } else if (ar === "remove") {
                                const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                                const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role is not included in of list of roles for the administrator permission level.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        blacklist: currentList
                                    }
                                }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                    .setTitle("Success")
                                    .setDescription("Setting successfully updated.")
                                    .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                    .setTimestamp()
                                    .send()
                                );
                            }
                        } else {
                            const subArgs = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(value);

                            const role = subArgs[1] ? message.guild.roles.get(subArgs[1]) : message.guild.roles.find(r => r.name.toLowerCase() === subArgs[2].toLowerCase());
                            if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription("Invalid role. Please make sure your spelling is correct, and that the role actually exists.").setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    blacklist: [ role.id ]
                                }
                            }).then(() => response.buildEmbed().setColor(0x00ADFF)
                                .setTitle("Success")
                                .setDescription("Setting successfully updated.")
                                .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                                .setTimestamp()
                                .send()
                            );
                        }
                    }
                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                }
            } else return response.usage(this);
        }
    }
};
