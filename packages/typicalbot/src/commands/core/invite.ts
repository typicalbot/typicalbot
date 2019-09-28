import { Message, MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: Message) {
        if (!message.embedable)
            return message.reply(
                message.translate('invite:TEXT', {
                    link: Constants.Links.OAUTH
                })
            );

        return message.reply(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('invite:TYPICAL_INVITE'))
                .setDescription(
                    message.translate('invite:TEXT', {
                        link: Constants.Links.OAUTH
                    })
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
