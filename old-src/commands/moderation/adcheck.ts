import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

const regex = /(discord\.(gg|io|me|li|plus|link)\/.+|discord(?:app)?\.com\/invite\/.+)/i;

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    execute(message: TypicalGuildMessage) {
        const list = [];

        for (const member of message.guild.members.cache.values()) {
            if (
                !member.user.presence.activities[0] ||
                !regex.test(member.user.presence.activities[0].name)
            )
                continue;

            list.push(`» ${member.displayName} (${member.id}) | ${member.user.presence.activities[0].name}`);
        }

        if (!message.embeddable)
            return message.send(list.length
                ? message.translate('moderation/adcheck:FOUND', {
                    amount: message.translate(list.length === 1
                        ? 'moderation/adcheck:ONE'
                        : 'moderation/adcheck:MULTIPLE', { amount: list.length }),
                    list: list.join('\n\n').substring(0, 2000)
                })
                : message.translate('moderation/adcheck:NONE'));

        return message.embed(new MessageEmbed()
            .setColor(0xff0000)
            .setTitle(message.translate('moderation/adcheck:TITLE'))
            .setDescription(list.length
                ? list.join('\n\n').substring(0, 2000)
                : message.translate('moderation/adcheck:NONE')));
    }
}
