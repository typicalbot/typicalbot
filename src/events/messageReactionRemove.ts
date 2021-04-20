import { MessageReaction, TextChannel } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMessage } from '../lib/types/typicalbot';

export default class MessageReactionRemove extends Event {
    async execute(messageReaction: MessageReaction) {
        const message = messageReaction.message as TypicalGuildMessage;
        if (message.partial) await message.fetch();

        if (
            message.channel.type !== 'text' ||
            !message.guild ||
            !message.guild.available
        )
            return;
        if (messageReaction.emoji.name !== '⭐') return;

        const settings = (message.guild.settings = await message.guild.fetchSettings());

        if (
            !settings.starboard.id ||
            settings.ignored.stars.includes(message.channel.id)
        )
            return;

        let { count } = messageReaction;
        if (count === null) count = 0;

        if (messageReaction.users.cache.get(message.author.id)) count--;

        const channel = message.guild.channels.cache.get(settings.starboard.id) as TextChannel;
        if (!channel || channel.type !== 'text') return;

        const messages = await channel.messages.fetch({ limit: 100 });
        const boardMsg = messages.find((m) => {
            if (!m.embeds.length) return false;
            const [embed] = m.embeds;
            return !(!embed.footer ||
                !embed.footer.text ||
                !embed.footer.text.startsWith('⭐') ||
                !embed.footer.text.endsWith(message.id));
        });

        if (!boardMsg) return;
        if (count < 1) return boardMsg.delete();

        const [boardEmbed] = boardMsg.embeds;

        return boardMsg.edit({
            embed: boardEmbed.setFooter(`⭐ ${count} | ${message.id}`)
        });
    }
}
