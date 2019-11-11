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
                .setTitle(message.translate('help/perms:LEVELS'))
                .setURL(Constants.Links.BASE)
                .setDescription(
                    message.translate('help/perms:VIEW_ALL', {
                        prefix: this.client.config.prefix
                    })
                )
                .addField(
                    message.translate('help/perms:BLACKLISTED'),
                    message.translate('help/perms:BLACKLISTED_VALUE')
                )
                .addField(
                    message.translate('help/perms:MEMBER'),
                    message.translate('help/perms:MEMBER_VALUE')
                )
                .addField(
                    message.translate('help/perms:DJ'),
                    message.translate('help/perms:DJ_VALUE')
                )
                .addField(
                    message.translate('help/perms:MODERATOR'),
                    message.translate('help/perms:MODERATOR_VALUE')
                )
                .addField(
                    message.translate('help/perms:ADMIN'),
                    message.translate('help/perms:ADMIN_VALUE')
                )
                .addField(
                    message.translate('help/perms:OWNER'),
                    message.translate('help/perms:OWNER_VALUE')
                )
                .setFooter('TypicalBot', Constants.Links.ICON)
                .setTimestamp()
        );
    }
}
