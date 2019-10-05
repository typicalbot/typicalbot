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
                .setTitle(message.translate('logs:POSSIBLE'))
                .setURL(Constants.Links.BASE)
                .setDescription(
                    message.translate('logs:VIEW_ALL', {
                        link: Constants.Links.SETTINGS
                    })
                )
                .addField(
                    message.translate('logs:ACTIVITY'),
                    message.translate('logs:ACTIVITY_VALUE')
                )
                .addField(
                    message.translate('logs:JOIN'),
                    message.translate('logs:JOIN_VALUE'),
                    true
                )
                .addField(
                    message.translate('logs:LEAVE'),
                    message.translate('logs:LEAVE_VALUE'),
                    true
                )
                .addField(
                    message.translate('logs:BAN'),
                    message.translate('logs:BAN_VALUE'),
                    true
                )
                .addField(
                    message.translate('logs:UNBAN'),
                    message.translate('logs:UNBAN_VALUE'),
                    true
                )
                .addField(
                    message.translate('logs:NICKNAME'),
                    message.translate('logs:NICKNAME_VALUE'),
                    true
                )
                .addField(
                    message.translate('logs:INVITE'),
                    message.translate('logs:INVITE_VALUE'),
                    true
                )
                .addField(
                    message.translate('logs:MODERATION'),
                    message.translate('logs:MODERATION_VALUE'),
                    false
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
