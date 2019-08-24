const Event = require("../structures/Event");
const { MessageEmbed } = require("discord.js");

class MessageReactionAdd extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(messageReaction, user) {
        if (messageReaction.message.channel.type !== "text" || !messageReaction.message.guild || !messageReaction.message.guild.available) return;
        if (messageReaction.emoji.name !== "⭐") return;

        const settings = messageReaction.message.guild.settings = await messageReaction.message.guild.fetchSettings();

        if (!settings.starboard.id) return;
        if (messageReaction.count < settings.starboard.count) return;
        if (!messageReaction.message.guild.channels.has(settings.starboard.id)) return;

        const channel = messageReaction.message.guild.channels.get(settings.starboard.id);

        const messages = await channel.messages.fetch({ limit: 100 });
        const board = messages.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(messageReaction.message.id));

        if (board) {
            const msg = await channel.messages.fetch(board.id);

            const embed = new MessageEmbed()
                .setColor(0xFFA500)
                .addField("Author", `<@!${messageReaction.message.author.id}>`, true)
                .addField("Channel", `<#${messageReaction.message.channel.id}>`, true)
                .addField("Message", messageReaction.message.content, false)
                .setThumbnail(messageReaction.message.author.avatarURL("png", 2048))
                .setTimestamp(messageReaction.message.createdAt)
                .setFooter(`⭐ ${messageReaction.count} | ${messageReaction.message.id}`);

            await msg.edit({ embed });
        } else {
            channel.buildEmbed()
                .setColor(0xFFA500)
                .addField("Author", `<@!${messageReaction.message.author.id}>`, true)
                .addField("Channel", `<#${messageReaction.message.channel.id}>`, true)
                .addField("Message", messageReaction.message.content, false)
                .setThumbnail(messageReaction.message.author.avatarURL("png", 2048))
                .setTimestamp(messageReaction.message.createdAt)
                .setFooter(`⭐ ${messageReaction.count} | ${messageReaction.message.id}`)
                .send();
        }
    }
}

module.exports = MessageReactionAdd;
