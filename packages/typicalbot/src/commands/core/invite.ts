import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalMessage) {
        if (!message.embedable)
            return message.reply(
                message.translate('core/invite:TEXT', {
                    link: Constants.Links.OAUTH
                })
            );

        return message.reply(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('core/invite:TYPICAL_INVITE'))
                .setDescription(
                    message.translate('core/invite:TEXT', {
                        link: Constants.Links.OAUTH
                    })
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
