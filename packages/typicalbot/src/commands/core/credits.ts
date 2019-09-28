import { Message, MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    execute(message: Message) {
        if (!message.embedable)
            return message.send(message.translate('credits:TEXT'));

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('credits:CREDITS'))
                .setDescription(message.translate('credits:TEXT'))
                .addField(
                    '» Aklixio#0588 (84430408447426560)',
                    message.translate('credits:DESIGNER')
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
