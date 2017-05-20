const Command = require("../../Structures/Command.js");
const RichEmbed = require("discord.js").RichEmbed;

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
            usage: "settings <'view'|'edit'> <setting> <value>",
            aliases: ["set"],
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let match = /(?:settings|set)\s+(list|view|edit)(?:\s+([\w-]+)\s*((?:.|[\r\n])+)?)?/i.exec(message.content);
        if (!match) return response.usage(this);

        let realPermissionLevel = this.client.permissionsManager.get(message.guild, message.author, true);

        let action = match[1], setting = match[2], value = match[3];

        if (action === "edit" && realPermissionLevel.level < 2) return response.perms({ permission: 2 }, realPermissionLevel);

        if (action === "list") {
            let page = setting || 1;
            let settings = Object.keys(settingsList);
            let count = Math.ceil(settings.length / 10);
            if (page < 1 || page > count) page = 1;

            let list = settings.splice((page -1) * 10, 10).map(k => ` • **${k}:** ${settingsList[k]}`);

            response.send(`**__Available settings to use with TypicalBot:__**\n\n**Page ${page} / ${count}**\n${list.join("\n")}`);
        } else if (action === "view") {
            if (setting) {
                if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                } else if (setting === "") {

                }
            } else {

            }
        } else if (action === "edit") {
            response.reply("Settings Edit");
        }
    }

    embedExecute(message, response, permissionLevel) {
        let match = /(?:settings|set)\s+(list|view|edit)(?:\s+([\w-]+)\s*((?:.|[\r\n])+)?)?/i.exec(message.content);
        if (!match) return response.usage(this);

        let realPermissionLevel = this.client.permissionsManager.get(message.guild, message.author, true);

        let action = match[1], setting = match[2], value = match[3];

        if (action === "edit" && realPermissionLevel.level < 2) return response.perms({ permission: 2 }, realPermissionLevel);

        if (action === "list") {
            let page = setting || 1;
            let settings = Object.keys(settingsList);
            let count = Math.ceil(settings.length / 10);
            if (page < 1 || page > count) page = 1;

            let list = settings.splice((page -1) * 10, 10);

            let embed = new RichEmbed()
                .setColor(0x00ADFF)
                .setTitle(`TypicalBot Settings | Page ${page} / ${count}`)
                .setFooter("TypicalBot", "https://typicalbot.com/images/icon.png")
                .setTimestamp();

            list.forEach(k => embed.addField(`» ${k}`, settingsList[k]));

            response.embed(embed);
        } else if (action === "view") {
            response.reply("Settings View");
        } else if (action === "edit") {
            response.reply("Settings Edit");
        }
    }
};
