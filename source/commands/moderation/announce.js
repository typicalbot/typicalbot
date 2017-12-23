const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Send an announcement to the announcements channel. Use the flag '-e' before your content to make the message an embed. If the announcements mention role is set, it will always use it.",
            usage: "announce ['-e'] <content>",
            mode: "strict",
            permission: 3
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(?:(-e)\s+)?((?:.|[\r\n])+)/i.exec(parameters);
        if (!args) return message.error(`No announcement content was supplied.`);

        const embed = args[1], content = args[2];

        const toChannel = message.guild.channels.get(message.guildSettings.announcements.id);
        if (!toChannel) return message.error(`There is not an announcements channel set up.`);

        const mentionRole = message.guild.roles.get(message.guildSettings.announcements.mention);

        embed ?
            toChannel.buildEmbed(mentionRole ? mentionRole.toString() : "").setColor(0x00adff).setTitle(`Announcement`).setDescription(content).setFooter(message.author.tag, message.author.avatarURL() || null).send(`${mentionRole ? mentionRole.toString() : ""}`) :
            toChannel.send(`**__Announcement from ${message.author.username}#${message.author.discriminator}:__**${mentionRole ? ` ${mentionRole.toString()}` : ""}\n\n${content}`);
    }
};
