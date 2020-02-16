import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embeddable)
            return message.send(
                message.translate('core/donate:TEXT', {
                    link: Constants.Links.DONATE
                })
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle('core/donate:SUPPORT')
                .setDescription(
                    message.translate(`donate:TEXT`, {
                        link: Constants.Links.DONATE
                    })
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
