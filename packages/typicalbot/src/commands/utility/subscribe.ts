import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage) {
        const role = message.guild.settings.subscriber
            ? message.guild.roles.get(message.guild.settings.subscriber)
            : null;

        if (!role) return message.error(message.translate('subscribe:NONE'));

        const subbed = await message.member.roles.add(role).catch(() => null);
        if (!subbed) return null;

        if (!message.embedable) return message.success('subscribe:SUBSCRIBED');

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('common:SUCCESS'))
                .setDescription(message.translate('subscribe:SUBSCRIBED'))
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
