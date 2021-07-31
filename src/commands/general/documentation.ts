import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { MODE, LINK } from '../../lib/utils/constants';

export default class extends Command {
    aliases = ['docs'];
    dm = true;
    mode = MODE.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('general/documentation:TEXT', {
                link: LINK.DOCUMENTATION
            }));

        return message.embed(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('general/documentation:TYPICAL_DOCS'))
            .setDescription(message.translate('general/documentation:TEXT', {
                link: LINK.DOCUMENTATION
            }))
            .setFooter('TypicalBot', LINK.ICON)
            .setTimestamp());
    }
}
