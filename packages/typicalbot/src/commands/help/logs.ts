import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage) {
        message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('help/logs:POSSIBLE'))
                .setURL(Constants.Links.BASE)
                .setDescription(
                    message.translate('help/logs:VIEW_ALL', {
                        link: Constants.Links.SETTINGS
                    })
                )
                .addField(
                    message.translate('help/logs:ACTIVITY'),
                    message.translate('help/logs:ACTIVITY_VALUE')
                )
                .addField(
                    message.translate('help/logs:JOIN'),
                    message.translate('help/logs:JOIN_VALUE'),
                    true
                )
                .addField(
                    message.translate('help/logs:LEAVE'),
                    message.translate('help/logs:LEAVE_VALUE'),
                    true
                )
                .addField(
                    message.translate('help/logs:BAN'),
                    message.translate('help/logs:BAN_VALUE'),
                    true
                )
                .addField(
                    message.translate('help/logs:UNBAN'),
                    message.translate('help/logs:UNBAN_VALUE'),
                    true
                )
                .addField(
                    message.translate('help/logs:NICKNAME'),
                    message.translate('help/logs:NICKNAME_VALUE'),
                    true
                )
                .addField(
                    message.translate('help/logs:INVITE'),
                    message.translate('help/logs:INVITE_VALUE'),
                    true
                )
                .addField(
                    message.translate('help/logs:MODERATION'),
                    message.translate('help/logs:MODERATION_VALUE'),
                    false
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
