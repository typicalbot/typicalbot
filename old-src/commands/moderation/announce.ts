import { TextChannel, MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

const regex = /(?:(-e)\s+)?((?:.|[\r\n])+)/i;

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;
    mode = MODE.STRICT;

    execute(message: TypicalGuildMessage, parameters?: string) {
        const usageError = message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: process.env.PREFIX
        });
        if (!parameters) return message.error(usageError);

        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('moderation/announce:INVALID'));
        args.shift();

        const [embed, content] = args;

        const channelID = message.guild.settings.announcements.id;
        if (!channelID)
            return message.error(message.translate('moderation/announce:INVALID_CHANNEL'));

        const channel = message.guild.channels.cache.get(`${BigInt(channelID)}`) as
            | TextChannel
            | undefined;
        if (!channel || (channel.type !== 'text' && channel.type !== 'news'))
            return message.error(message.translate('moderation/announce:INVALID_CHANNEL'));

        const roleID = message.guild.settings.announcements.mention;
        const mentionRole = roleID
            ? message.guild.roles.cache.get(`${BigInt(roleID)}`)
            : null;

        if (!embed) {
            return channel.send(`${message.translate('moderation/announce:TEXT', {
                usertag: message.author.tag,
                role: mentionRole ? mentionRole.toString() : ''
            })}\n\n${content}`);
        }

        return channel.send({ content: mentionRole ? mentionRole.toString() : '',
            embeds: [new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('moderation/announce:TITLE'))
                .setDescription(content)
                .setFooter(message.author.tag, message.author.displayAvatarURL())]
        });
    }
}
