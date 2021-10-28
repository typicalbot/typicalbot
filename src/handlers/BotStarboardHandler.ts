import Handler from '../lib/handler/Handler';
import { MessageEmbed, TextChannel } from 'discord.js';

const BotStarboardHandler: Handler<'messageReactionAdd'> = async (client, message) => {
    const msg = message.message;

    if (msg.partial) await message.fetch();
    if (msg.channel.type !== 'text' || !msg.guild || !msg.guild.available) return;
    if (message.emoji.name !== '⭐') return;

    const settings = await client.settings.fetch(msg.guild.id);
    if (!settings.starboard.id || settings.ignored.stars.includes(msg.channel.id)) return;

    let { count } = message;
    if (count === null) count = 0;
    if (message.users.cache.get(msg.author!.id)) count++;
    if (count < settings.starboard.count) return;

    const channel = msg.guild.channels.cache.get(`${BigInt(settings.starboard.id)}`) as TextChannel;
    if (!channel || channel.type !== 'text') return;

    const messages = await channel.messages.fetch({ limit: 100 });
    const boardMsg = messages.find((m) => {
        if (!m.embeds.length) return false;
        const [embed] = m.embeds;
        return !(!embed.footer || !embed.footer.text || !embed.footer.text.startsWith('⭐') || !embed.footer.text.endsWith(msg.id));
    });

    if (boardMsg) {
        const [boardEmbed] = boardMsg.embeds;

        return boardMsg.edit({
            embeds: [boardEmbed.setFooter(`⭐ ${count} | ${msg.id}`)]
        });
    }

    const image = msg.attachments.size > 0 ? msg.attachments.array()[0].url : null;
    const jump = `https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`;

    const _ = (key: string, args?: Record<string, unknown>) => {
        const lang = client.translate.get(settings.language || 'en_US');

        if (!lang) throw new Error('Message: Invalid language set in settings.');

        return lang(key, args);
    };

    const embed = new MessageEmbed()
        .setColor(0xffa500)
        .addFields([
            {
                name: _('common:AUTHOR'),
                value: msg.author!.toString(),
                inline: true
            },
            {
                name: 'Original',
                value: `[Jump](${jump})`,
                inline: true
            }
        ])
        .setThumbnail(msg.author!.displayAvatarURL({ format: 'png', size: 2048 }))
        .setTimestamp(msg.createdAt)
        .setFooter(`⭐ ${count} | ${msg.id}`);

    if (image) {
        embed.setImage(image);
    } else {
        embed.addFields([
            {
                name: _('common:MESSAGE'),
                value: `${msg.content}`,
                inline: false
            }
        ]);
    }

    return channel.send({ embeds: [embed] });
};

const BotStarboardHandlerTwo: Handler<'messageReactionRemove'> = async (client, reaction) => {
    const msg = reaction.message;

    if (msg.partial) await msg.fetch();
    if (msg.channel.type !== 'text' || !msg.guild || !msg.guild.available) return;
    if (reaction.emoji.name !== '⭐') return;

    const settings = await client.settings.fetch(msg.guild.id);
    if (!settings.starboard.id || settings.ignored.stars.includes(msg.channel.id)) return;

    let { count } = reaction;
    if (count === null) count = 0;
    if (reaction.users.cache.get(msg.author!.id)) count--;

    const channel = msg.guild.channels.cache.get(`${BigInt(settings.starboard.id)}`) as TextChannel;
    if (!channel || channel.type !== 'text') return;

    const messages = await channel.messages.fetch({ limit: 100 });
    const boardMsg = messages.find((m) => {
        if (!m.embeds.length) return false;
        const [embed] = m.embeds;
        return !(!embed.footer || !embed.footer.text || !embed.footer.text.startsWith('⭐') || !embed.footer.text.endsWith(msg.id));
    });

    if (!boardMsg) return;
    if (count < 1) return boardMsg.delete();

    const [boardEmbed] = boardMsg.embeds;

    return boardMsg.edit({
        embeds: [boardEmbed.setFooter(`⭐ ${count} | ${msg.id}`)]
    });
};

export {
    BotStarboardHandler,
    BotStarboardHandlerTwo
};
