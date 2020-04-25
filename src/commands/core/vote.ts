import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { Modes, Links } from '../../lib/utils/constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    dm = true;
    mode = Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('core/vote:TEXT', {
                link: Links.VOTE
            }));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('core/vote:TITLE'))
            .setDescription(message.translate('core/vote:TEXT', {
                link: Links.VOTE
            }))
            .setFooter('TypicalBot', Links.ICON)
            .setTimestamp());
    }
}
