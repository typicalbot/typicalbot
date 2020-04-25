import { MessageEmbed, MessageReaction, TextChannel } from 'discord.js';
import Event from '../lib/structures/Event';
import { TypicalGuildMessage } from '../lib/types/typicalbot';

export default class MessageReactionAdd extends Event {
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

        if (count < settings.starboard.count) return;

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

        if (boardMsg) {
            const [boardEmbed] = boardMsg.embeds;

            return boardMsg.edit({
                embed: boardEmbed.setFooter(`⭐ ${count} | ${message.id}`)
            });
        }

        const image =
            message.attachments.size > 0
                ? message.attachments.array()[0].url
                : null;

        const embed = new MessageEmbed()
            .setColor(0xffa500)
            .addFields([
                {
                    name: message.translate('common:AUTHOR'),
                    value: message.author.toString(),
                    inline: true
                },
                {
                    name: message.channel.toString(),
                    value: true
                }
            ])
            .setThumbnail(message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp(message.createdAt)
            .setFooter(`⭐ ${count} | ${message.id}`);

        if (image) {
            embed.setImage(image);
        } else {
            embed.addFields([
                {
                    name: message.translate('common:MESSAGE'),
                    value: message.content,
                    inline: false
                }
            ]);
        }

        return channel.send({ embed });
    }
}
