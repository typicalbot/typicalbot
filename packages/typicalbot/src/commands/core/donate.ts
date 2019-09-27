import { Message, MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';

export default class extends Command {
    dm = true;

    mode = Constants.Modes.STRICT;

    static execute(message: Message) {
        if (!message.embedable) return message.send(message.translate('donate:TEXT', { link: Constants.Links.DONATE }));

        return message.send(new MessageEmbed()
            .setColor(0x00ADFF)
            .setTitle('donate:SUPPORT')
            .setDescription(message.translate(`donate:TEXT`, { link: Constants.Links.DONATE }))
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTimestamp()
        );
    }
};
