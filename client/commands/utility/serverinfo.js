const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);
const moment = require("moment");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Displays the server's information.",
            usage: "serverinfo",
            aliases: ["sinfo"],
            mode: Constants.Modes.STRICT
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(.+)/i.exec(parameters);
        const option = args ? args[1] : null;

        const guildOwner = message.guild.member(message.guild.ownerID);

        /*if (!option) return*/ message.reply(
            `**__Server Information For:__** ${message.guild.name}\n`
            + `\`\`\`\n`
            + `Name                : ${message.guild.name} (${message.guild.id})\n`
            + `Owner               : ${guildOwner.user.username}#${guildOwner.user.discriminator} (${guildOwner.user.id})\n`
            + `Created             : ${moment(message.guild.createdAt).format("dddd MMMM Do, YYYY, hh:mm A")}\n`
            + `Region              : ${message.guild.region}\n`
            + `Verification Level  : ${message.guild.verificationLevel}\n`
            + `Icon                : ${message.guild.iconURL({ "format": "png", "size": 2048 }) || "None"}\n`
            + `Channels            : ${message.guild.channels.size}\n`
            + `Members             : ${message.guild.memberCount}\n`
            + `Roles               : ${message.guild.roles.size}\n`
            + `Emojis              : ${message.guild.emojis.size}\n`
            + `\`\`\``
        );
    }

    embedExecute(message, parameters, permissionLevel) {
        const match = /(.+)/i.exec(parameters);
        const option = match ? match[1] : null;

        const guildOwner = message.guild.member(message.guild.ownerID).user;

        /*if (!option) return*/ message.buildEmbed()
            .setColor(0x00ADFF)
            .setTitle(`Server Information`)
            .addField("» Name", message.guild.name, true)
            .addField("» ID", message.guild.id, true)
            .addField("» Owner", `${guildOwner.tag}\n${guildOwner.id}`, true)
            .addField("» Created", `${moment(message.guild.createdAt).format("dddd MMMM Do, YYYY")}\n${moment(message.guild.createdAt).format("hh:mm A")}`, true)
            .addField("» Region", message.guild.region.toUpperCase(), true)
            .addField("» Verification Level", message.guild.verificationLevel, true)
            .addField("» Channels", message.guild.channels.size, true)
            .addField("» Members", message.guild.memberCount, true)
            .addField("» Roles", message.guild.roles.size, true)
            .addField("» Emojis", message.guild.emojis.size, true)
            .setThumbnail(message.guild.iconURL({ "format": "png", "size": 2048 }) || null)
            .setFooter("TypicalBot", Constants.Links.ICON)
            .send();
    }
};



/*
let embed = message.guild.settings.embed === "Y";
let after = message.content.split(" ")[1];

let owner = message.guild.owner ? message.guild.owner : message.guild.member(message.guild.ownerID);

if (!after) {
    if (embed) {
        return message.send("", {
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
        return message.reply(
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
    return message.reply(
        `**__Roles for server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
    );
}
if (after === "channels") {
    let page = message.content.split(" ")[2];
    let paged = client.functions.pagify(
        message.guild.channels.filter(c => c.type === "text").array().sort((a,b) => a.position - b.position).map(c => `${lengthen(c.name, 20)} : ${c.id}`),
        page
    );
    return message.reply(
        `**__Text Channels for server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
    );
}
if (after === "bots") {
    let page = message.content.split(" ")[2];
    let paged = client.functions.pagify(
        message.guild.members.filter(m => m.user.bot).map(b => `${client.functions.lengthen(b.user.username, 20)} : ${b.user.id}`),
        page
    );
    return message.reply(
        `**__Bots in server:__** ${message.guild.name}\n\`\`\`autohotkey\n${paged}\`\`\``
    );
}
if (userlevel < 7) return;
let settingslist = after === "s";

let transmit = settingslist ?
    { channel: message.channel.id, guild: message.content.split(" ")[2], settings: true } :
    { channel: message.channel.id, guild: after };

client.transmit("serverinfo", transmit);*/
