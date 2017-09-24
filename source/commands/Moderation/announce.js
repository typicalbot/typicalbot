const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "announce",
            description: "Send an announcement to the announcements channel. Use the flag '-e' before your content to make the message an embed. If the announcements mention role is set, it will always use it.",
            usage: "announce ['-e'] <content>",
            mode: "strict",
            permission: 3
        });
    }

    execute(message, response, permissionLevel) {
        const args = /announce(?:\s+(-e))?\s+((?:.|[\r\n])+)/i.exec(message.content);
        if (!args) return response.error(`No announcement content was supplied.`);

        const embed = args[1], content = args[2];

        const toChannel = message.guild.channels.get(message.guild.settings.announcements.id);
        if (!toChannel) return response.error(`There is not an announcements channel set up.`);

        const mentionRole = message.guild.roles.get(message.guild.settings.announcements.mention);

        embed ?
            toChannel.buildEmbed().setColor(0x00adff).setTitle(`Announcement`).setDescription(content).setFooter(message.author.tag, message.author.avatarURL() || null).send(`${mentionRole ? mentionRole.toString() : ""}`) :
            toChannel.send(`**__Announcement from ${message.author.username}#${message.author.discriminator}:__**\n\n${content}`);
    }
};
