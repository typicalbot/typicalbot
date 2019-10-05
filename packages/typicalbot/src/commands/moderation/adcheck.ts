import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

const regex = /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i;

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
    mode = Constants.Modes.STRICT;

    execute(message: TypicalGuildMessage) {
        const list = [];

        for (const member of message.guild.members.values()) {
            if (
                !member.user.presence.activity ||
                !regex.test(member.user.presence.activity.name)
            )
                continue;

            list.push(
                `» ${member.displayName} (${member.id}) | ${member.user.presence.activity.name}`
            );
        }

        if (!message.embedable)
            return message.send(
                list.length
                    ? message.translate('adcheck:FOUND', {
                          amount: message.translate(
                              list.length === 1
                                  ? 'adcheck:ONE'
                                  : 'adcheck:MULTIPLE',
                              { amount: list.length }
                          ),
                          list: list.join('\n\n').substring(0, 2000)
                      })
                    : message.translate('adcheck:NONE')
            );

        return message.send(
            new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(message.translate('adcheck:TITLE'))
                .setDescription(
                    list.length
                        ? list.join('\n\n').substring(0, 2000)
                        : message.translate('adcheck:NONE')
                )
        );
    }
}
