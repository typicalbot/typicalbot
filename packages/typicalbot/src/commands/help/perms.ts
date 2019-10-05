import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage) {
        message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(message.translate('perms:LEVELS'))
                .setURL(Constants.Links.BASE)
                .setDescription(
                    message.translate('perms:VIEW_ALL', {
                        prefix: this.client.config.prefix
                    })
                )
                .addField(
                    message.translate('perms:BLACKLISTED'),
                    message.translate('perms:BLACKLISTED_VALUE')
                )
                .addField(
                    message.translate('perms:MEMBER'),
                    message.translate('perms:MEMBER_VALUE')
                )
                .addField(
                    message.translate('perms:DJ'),
                    message.translate('perms:DJ_VALUE')
                )
                .addField(
                    message.translate('perms:MODERATOR'),
                    message.translate('perms:MODERATOR_VALUE')
                )
                .addField(
                    message.translate('perms:ADMIN'),
                    message.translate('perms:ADMIN_VALUE')
                )
                .addField(
                    message.translate('perms:OWNER'),
                    message.translate('perms:OWNER_VALUE')
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
