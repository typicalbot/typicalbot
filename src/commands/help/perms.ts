import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, LINK, WEBSITE } from '../../lib/utils/constants';

export default class extends Command {
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage) {
        await message.embed(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(message.translate('help/perms:LEVELS'))
            .setURL(WEBSITE)
            .setDescription(message.translate('help/perms:VIEW_ALL', {
                prefix: process.env.PREFIX
            }))
            .addFields([
                {
                    name: message.translate('help/perms:BLACKLISTED'),
                    value: message.translate('help/perms:BLACKLISTED_VALUE')
                },
                {
                    name: message.translate('help/perms:MEMBER'),
                    value: message.translate('help/perms:MEMBER_VALUE')
                },
                {
                    name: message.translate('help/perms:MODERATOR'),
                    value: message.translate('help/perms:MODERATOR_VALUE')
                },
                {
                    name: message.translate('help/perms:ADMIN'),
                    value: message.translate('help/perms:ADMIN_VALUE')
                },
                {
                    name: message.translate('help/perms:OWNER'),
                    value: message.translate('help/perms:OWNER_VALUE')
                }
            ])
            .setFooter('TypicalBot', LINK.ICON)
            .setTimestamp());
    }
}
