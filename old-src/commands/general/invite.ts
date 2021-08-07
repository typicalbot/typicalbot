import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { MODE, LINK } from '../../lib/utils/constants';

export default class extends Command {
    dm = true;
    mode = MODE.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.reply(message.translate('general/invite:TEXT', {
                link: LINK.OAUTH
            }));

        return message.reply({ embeds: [new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('general/invite:TYPICAL_INVITE'))
            .setDescription(message.translate('general/invite:TEXT', {
                link: LINK.OAUTH
            }))
            .setFooter('TypicalBot', LINK.ICON)
            .setTimestamp()] });
    }
}
