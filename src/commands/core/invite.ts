import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { Modes, Links } from '../../lib/utils/constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    dm = true;
    mode = Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.reply(message.translate('core/invite:TEXT', {
                link: Links.OAUTH
            }));

        return message.reply(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('core/invite:TYPICAL_INVITE'))
            .setDescription(message.translate('core/invite:TEXT', {
                link: Links.OAUTH
            }))
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
