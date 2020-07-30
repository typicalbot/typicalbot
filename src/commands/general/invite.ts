import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { Modes, Links } from '../../lib/utils/constants';

export default class extends Command {
    dm = true;
    mode = Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.reply(message.translate('general/invite:TEXT', {
                link: Links.OAUTH
            }));

        return message.reply(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('general/invite:TYPICAL_INVITE'))
            .setDescription(message.translate('general/invite:TEXT', {
                link: Links.OAUTH
            }))
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
