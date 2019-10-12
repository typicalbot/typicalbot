import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage, PermissionLevel } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
    mode = Constants.Modes.STRICT;

    async execute(
        message: TypicalGuildMessage,
        parameters: string,
        permissionLevel: PermissionLevel
    ) {
        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(parameters);
        if (!args)
            return message.error(
                message.translate('misc:USAGE_ERROR', {
                    name: this.name,
                    prefix: this.client.config.prefix
                })
            );
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
            (permissionLevel.level !== 4 && permissionLevel.level < 9)
        )
            return message.error(message.translate('kick:TOO_LOW'));

        if (!member.kickable)
            return message.error(message.translate('kick:KICKABLE'));

        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTitle(message.translate('common:ALERT_SYSTEM'))
            .setDescription(
                message.translate('kick:KICKED', { name: message.guild.name })
            )
            .addField(
                message.translate('common:MODERATOR_FIELD'),
                message.author.tag
            );
        if (reason)
            embed.addField(message.translate('common:REASON_FIELD'), reason);

        await member.send().catch(() => null);

        const kicked = await member
            .kick(
                message.translate('kick:REASON', {
                    mod: message.author.tag,
                    reason: reason || message.translate('common:NO_REASON')
                })
            )
            .catch(() => null);
        if (!kicked) return message.error(message.translate('kick:ERROR'));

        if (message.guild.settings.logs.moderation) {
            const newCase = await message.guild.buildModerationLog();

            newCase
                .setAction(Constants.ModerationLogTypes.KICK)
                .setModerator(message.author)
                .setUser(member.user);
            if (reason) newCase.setReason(reason);
            newCase.send();
        }

        return message.success(
            message.translate('kick:KICK_SUCCESS', {
                user: member.user.tag
            })
        );
    }
}
