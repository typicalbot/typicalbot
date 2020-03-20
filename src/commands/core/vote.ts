import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import { TypicalMessage } from '../../types/typicalbot';
import Constants from '../../utility/Constants';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(message.translate('core/vote:TEXT', {
                link: Constants.Links.VOTE
            }));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('core/vote:TITLE'))
            .setDescription(message.translate('core/vote:TEXT', {
                link: Constants.Links.VOTE
            }))
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTimestamp());
    }
}
