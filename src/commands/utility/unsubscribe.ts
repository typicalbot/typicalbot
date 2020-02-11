import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage) {
        const role = message.guild.settings.subscriber
            ? message.guild.roles.cache.get(message.guild.settings.subscriber)
            : null;

        if (!role)
            return message.error(
                'No subscriber role is set up for this server.'
            );

        const removed = await message.member.roles
            .remove(role)
            .catch(() => null);

        if (!removed) return null;

        if (!message.embedable)
            return message.reply(
                message.translate('utility/unsubscribe:UNSUBBED')
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('common:SUCCESS'))
                .setDescription(
                    message.translate('utility/unsubscribe:UNSUBBED')
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
