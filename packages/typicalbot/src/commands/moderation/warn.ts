import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import PermissionLevel from '../../structures/PermissionLevel';
import { MessageEmbed } from 'discord.js';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
    mode = Constants.Modes.STRICT;

    async execute(
        message: TypicalGuildMessage,
        parameters: string,
        permissionLevel: PermissionLevel
    ) {
        if (!message.guild.settings.logs.moderation)
            return message.error(message.translate('reason:DISABLED'));

        const args = regex.exec(parameters);
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
            return message.error(message.translate('warn:TOO_LOW'));

        const newCase = await message.guild.buildModerationLog();
        newCase
            .setAction(Constants.ModerationLogTypes.WARN)
            .setModerator(message.author)
            .setUser(member.user);
        if (reason) newCase.setReason(reason);
        newCase.send();

        const embed = new MessageEmbed()
            .setColor(Constants.ModerationLogTypes.WARN.hex)
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTitle(message.translate('common:ALERT_SYSTEM'))
            .setDescription(
                message.translate('warn:WARNED', { name: message.guild.name })
            )
            .addField(
                message.translate('common:MODERATOR_FIELD'),
                message.author.tag
            );
        if (reason)
            embed.addField(message.translate('common:REASON_FIELD'), reason);
        member.send().catch(() => null);

        return message.success(message.translate('warn:SUCCESS'));
    }
}
