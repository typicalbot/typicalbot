import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';
import Constants from '../../utility/Constants';

export default class extends Command {
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage) {
        await message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('help/logs:POSSIBLE'))
            .setURL(Constants.Links.BASE)
            .setDescription(message.translate('help/logs:VIEW_ALL', {
                link: Constants.Links.SETTINGS
            }))
            .addFields([
                {
                    name: message.translate('help/logs:ACTIVITY'),
                    value: message.translate('help/logs:ACTIVITY_VALUE')
                },
                {
                    name: message.translate('help/logs:JOIN'),
                    value: message.translate('help/logs:JOIN_VALUE'),
                    inline: true
                },
                {
                    name: message.translate('help/logs:LEAVE'),
                    value: message.translate('help/logs:LEAVE_VALUE'),
                    inline: true
                },
                {
                    name: message.translate('help/logs:BAN'),
                    value: message.translate('help/logs:BAN_VALUE'),
                    inline: true
                },
                {
                    name: message.translate('help/logs:UNBAN'),
                    value: message.translate('help/logs:UNBAN_VALUE'),
                    inline: true
                },
                {
                    name: message.translate('help/logs:NICKNAME'),
                    value: message.translate('help/logs:NICKNAME_VALUE'),
                    inline: true
                },
                {
                    name: message.translate('help/logs:INVITE'),
                    value: message.translate('help/logs:INVITE_VALUE'),
                    inline: true
                },
                {
                    name: message.translate('help/logs:MODERATION'),
                    value: message.translate('help/logs:MODERATION_VALUE'),
                    inline: false
                }
            ])
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTimestamp());
    }
}
