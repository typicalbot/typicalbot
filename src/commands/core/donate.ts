import { MessageEmbed } from 'discord.js';
import { Modes, Links } from '../../lib/utils/constants';
import Command from '../../structures/Command';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    dm = true;
    mode = Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('core/donate:TEXT', {
                link: Links.DONATE
            }));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('core/donate:SUPPORT'))
            .setDescription(message.translate('core/donate:TEXT', {
                link: Links.DONATE
            }))
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
