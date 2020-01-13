const Event = require("../structures/Event");
const { MessageEmbed } = require("discord.js");

class MessageReactionRemove extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(messageReaction, user) {
        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (messageReaction.message.channel.type !== "text" || !messageReaction.message.guild || !messageReaction.message.guild.available) return;
        if (messageReaction.emoji.name !== "⭐") return;

        const settings = messageReaction.message.guild.settings = await messageReaction.message.guild.fetchSettings();

        if (!settings.starboard.id) return;
        if (settings.ignored.stars.includes(messageReaction.message.channel.id)) return;

        let count = messageReaction.count;
        if (messageReaction.users.get(messageReaction.message.author.id)) count--;

        if (!messageReaction.message.guild.channels.has(settings.starboard.id)) return;

        const channel = messageReaction.message.guild.channels.get(settings.starboard.id);

        const messages = await channel.messages.fetch({ limit: 100 });
        const boardMsg = messages.find(m => m.embeds.length > 0 && m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(messageReaction.message.id));

        if (boardMsg) {
            if (count < 1) return boardMsg.delete();

            const image = boardMsg.embeds[0] ? boardMsg.embeds[0].image ? boardMsg.embeds[0].image.proxyURL ? boardMsg.embeds[0].image.proxyURL : null : null : null;

            const embed = new MessageEmbed()
                .setColor(0xFFA500)
                .addField("Author", `<@!${messageReaction.message.author.id}>`, true)
                .addField("Channel", `<#${messageReaction.message.channel.id}>`, true)
                .setThumbnail(messageReaction.message.author.avatarURL({format: "png", size: 2048, dynamic: true}))
                .setTimestamp(messageReaction.message.createdAt)
                .setFooter(`⭐ ${count} | ${messageReaction.message.id}`);

            if (image) {
                embed.setImage(image);
            } else {
                embed.addField("Message", messageReaction.message.content, false);
            }

            await boardMsg.edit({ embed });
        }
    }
}

module.exports = MessageReactionRemove;
