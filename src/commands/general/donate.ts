import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { MODE, LINK } from '../../lib/utils/constants';

export default class extends Command {
    dm = true;
    mode = MODE.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('general/donate:TEXT', {
                link: LINK.DONATE
            }));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('general/donate:SUPPORT'))
            .setDescription(message.translate('general/donate:TEXT', {
                link: LINK.DONATE
            }))
            .setFooter('TypicalBot', LINK.ICON)
            .setTimestamp());
    }
}
