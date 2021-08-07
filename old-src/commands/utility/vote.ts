import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { MODE, LINK } from '../../lib/utils/constants';

export default class extends Command {
    dm = true;
    mode = MODE.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('utility/vote:TEXT', {
                link: LINK.VOTE
            }));

        return message.embed(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('utility/vote:TITLE'))
            .setDescription(message.translate('utility/vote:TEXT', {
                link: LINK.VOTE
            }))
            .setFooter('TypicalBot', LINK.ICON)
            .setTimestamp());
    }
}
