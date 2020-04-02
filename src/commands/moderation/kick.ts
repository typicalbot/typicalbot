import { MessageEmbed } from 'discord.js';
import Command from '../../structures/Command';
import { TypicalGuildMessage, PermissionLevel } from '../../types/typicalbot';
import Constants from '../../utility/Constants';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;
export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage,
        parameters: string,
        permissionLevel: PermissionLevel) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: this.client.config.prefix
            }));
        args.shift();

        const [userID, reason] = args;

        const member = await message.guild.members
            .fetch(userID)
            .catch(() => null);
        if (!member)
            return message.error(message.translate('common:USER_NOT_FOUND'));

        if (
            message.member.roles.highest.position <=
                member.roles.highest.position &&
            permissionLevel.level !== 4 &&
            permissionLevel.level < 9
        )
            return message.error(message.translate('moderation/kick:TOO_LOW'));

        if (!member.kickable)
            return message.error(message.translate('moderation/kick:KICKABLE'));

        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTitle(message.translate('common:ALERT_SYSTEM'))
            .setDescription(message.translate('moderation/kick:KICKED', {
                name: message.guild.name
            }))
            .addFields([
                {
                    name: message.translate('common:MODERATOR_FIELD'),
                    value: message.author.tag
                }
            ]);
        if (reason)
            embed.addFields([
                {
                    name: message.translate('common:REASON_FIELD'),
                    value: reason
                }
            ]);

        await member.send(embed).catch(() => null);

        const kicked = await member
            .kick(message.translate('moderation/kick:REASON', {
                mod: message.author.tag,
                reason: reason || message.translate('common:NO_REASON')
            }))
            .catch(() => null);
        if (!kicked)
            return message.error(message.translate('moderation/kick:ERROR'));

        if (message.guild.settings.logs.moderation) {
            const newCase = await message.guild.buildModerationLog();

            newCase
                .setAction(Constants.ModerationLogTypes.KICK)
                .setModerator(message.author)
                .setUser(member.user);
            if (reason) newCase.setReason(reason);
            await newCase.send();
        }

        return message.success(message.translate('moderation/kick:KICK_SUCCESS', {
            user: member.user.tag
        }));
    }
}
