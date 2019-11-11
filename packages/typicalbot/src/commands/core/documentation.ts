import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['docs'];
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embedable)
            return message.send(
                message.translate('core/documentation:TEXT', {
                    link: Constants.Links.DOCUMENTATION
                })
            );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('core/documentation:TYPICAL_DOCS'))
                .setDescription(
                    message.translate('core/documentation:TEXT', {
                        link: Constants.Links.DOCUMENTATION
                    })
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
