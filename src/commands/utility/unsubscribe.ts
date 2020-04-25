import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { Modes, Links } from '../../lib/utils/constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    mode = Modes.STRICT;

    async execute(message: TypicalGuildMessage) {
        const role = message.guild.settings.subscriber
            ? message.guild.roles.cache.get(message.guild.settings.subscriber)
            : null;

        if (!role)
            return message.error('No subscriber role is set up for this server.');

        const removed = await message.member.roles
            .remove(role)
            .catch(() => null);

        if (!removed) return null;

        if (!message.embeddable)
            return message.reply(message.translate('utility/unsubscribe:UNSUBBED'));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('common:SUCCESS'))
            .setDescription(message.translate('utility/unsubscribe:UNSUBBED'))
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
