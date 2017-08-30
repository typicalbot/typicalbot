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
    "ann-mention": "A mention to be put in the announcement when posted, such as a Subscriber role.",
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

    execute(message, response, permissionLevel) {const match = /(?:settings|set)\s+(list|view|edit)(?:\s+([\w-]+)\s*(?:(add|remove)\s+)?((?:.|[\r\n])+)?)?/i.exec(message.content);
        if (!match) return response.usage(this);

        const actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);

        const action = match[1], setting = match[2], ar = match[3], value = match[4];

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
                if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                }
            } else {
                response.send(`**__Currently Set Settings:__**\n\n`);
            }
        } else if (action === "edit") {
            if (setting && value) {
                if (setting === "embed") {
                    if (value === "enable") {
                        this.client.settingsManager.update(message.guild.id, {
                            embed: true
                        }).then(() => response.success("Setting successfully updated."));
                    } else if (value === "disable") {
                        this.client.settingsManager.update(message.guild.id, {
                            embed: false
                        }).then(() => response.success("Setting successfully updated."));
                    } else {
                        response.error("An invalid option was supplied.");
                    }
                } else if (setting === "adminrole" || setting === "3") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { administrator: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error(`The specified role is already included in the list of roles for the administrator permission level.`);

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        administrator: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error(`The specified role is not included in of list of roles for the administrator permission level.`);

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        administrator: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.error(`The role you specified does not exist.`);

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    administrator: [ role.id ]
                                }
                            }).then(() => response.success("Setting successfully updated."));
                        }
                    }
                } else if (setting === "modrole" || setting === "2") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { moderator: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error(`The specified role is already included in the list of roles for the administrator permission level.`);

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        moderator: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error(`The specified role is not included in of list of roles for the administrator permission level.`);

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        moderator: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.error(`The role you specified does not exist.`);

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    moderator: [ role.id ]
                                }
                            }).then(() => response.success("Setting successfully updated."));
                        }
                    }
                } else if (setting === "djrole" || setting === "1") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { dj: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error(`The specified role is already included in the list of roles for the administrator permission level.`);

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        dj: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error(`The specified role is not included in of list of roles for the administrator permission level.`);

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        dj: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.error(`The role you specified does not exist.`);

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    dj: [ role.id ]
                                }
                            }).then(() => response.success("Setting successfully updated."));
                        }
                    }
                } else if (setting === "blacklistrole" || setting === "-1") {
                    if (value === "disable" || value === "clear") {
                        this.client.settingsManager.update(message.guild.id, { roles: { blacklist: [] }}).then(() => response.success("Setting successfully updated."));
                    } else {
                        if (ar) {
                            if (ar === "add") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (currentList.includes(role.id)) return response.error(`The specified role is already included in the list of roles for the administrator permission level.`);

                                currentList.push(role.id);

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        blacklist: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            } else if (ar === "remove") {
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.error(`The role you specified does not exist.`);

                                const currentList = message.guild.settings.roles.administrator;
                                if (!currentList.includes(role.id)) return response.error(`The specified role is not included in of list of roles for the administrator permission level.`);

                                currentList.splice(currentList.indexOf(role.id));

                                this.client.settingsManager.update(message.guild.id, {
                                    roles: {
                                        blacklist: currentList
                                    }
                                }).then(() => response.success("Setting successfully updated."));
                            }
                        } else {
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.error(`The role you specified does not exist.`);

                            this.client.settingsManager.update(message.guild.id, {
                                roles: {
                                    blacklist: [ role.id ]
                                }
                            }).then(() => response.success("Setting successfully updated."));
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

    embedExecute(message, response, permissionLevel) {
        const match = /(?:settings|set)\s+(list|view|edit)(?:\s+([\w-]+)\s*(?:(add|remove)\s+)?((?:.|[\r\n])+)?)?/i.exec(message.content);
        if (!match) return response.usage(this);

        const realPermissionLevel = this.client.permissionsManager.get(message.guild, message.author, true);

        const action = match[1], setting = match[2], ar = match[3], value = match[4];

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
                            .setDescription(`An invalid option was supplied.`)
                            .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                            .setTimestamp()
                            .send();
                    }
                } else if (setting === "adminrole" || setting === "3") {
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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The role you specified does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The role you specified does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                                const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                                const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                                if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The specified role does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
                            const inputRole = /(?:<@&)?(\d{17,20})>?/i.exec(value);

                            const role = inputRole ? message.guild.roles.get(inputRole[1]) : message.guild.roles.find(r => r.name.toLowerCase() === value.toLowerCase());
                            if (!role) return response.buildEmbed().setColor(0xFF0000).setTitle("Error").setDescription(`The role you specified does not exist.`).setFooter("TypicalBot", "https://typicalbot.com/images/icon.png").setTimestamp().send();

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
