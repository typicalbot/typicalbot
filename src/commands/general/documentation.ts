import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { Modes, Links } from '../../lib/utils/constants';

export default class extends Command {
    aliases = ['docs'];
    dm = true;
    mode = Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('general/documentation:TEXT', {
                link: Links.DOCUMENTATION
            }));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('general/documentation:TYPICAL_DOCS'))
            .setDescription(message.translate('general/documentation:TEXT', {
                link: Links.DOCUMENTATION
            }))
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
