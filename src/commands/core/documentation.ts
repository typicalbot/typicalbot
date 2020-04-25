import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { Modes, Links } from '../../lib/utils/constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['docs'];
    dm = true;
    mode = Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('core/documentation:TEXT', {
                link: Links.DOCUMENTATION
            }));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('core/documentation:TYPICAL_DOCS'))
            .setDescription(message.translate('core/documentation:TEXT', {
                link: Links.DOCUMENTATION
            }))
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
