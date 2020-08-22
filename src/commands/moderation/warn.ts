import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import PermissionLevel from '../../lib/structures/PermissionLevel';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL, LINK, MODERATION_LOG_TYPE } from '../../lib/utils/constants';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage,
        parameters: string,
        permissionLevel: PermissionLevel) {
        if (!message.guild.settings.logs.moderation)
            return message.error(message.translate('moderation/reason:DISABLED'));

        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
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
            return message.error(message.translate('moderation/warn:TOO_LOW'));

        const newCase = await message.guild.buildModerationLog();
        newCase
            .setAction(MODERATION_LOG_TYPE.WARN)
            .setModerator(message.author)
            .setUser(member.user);
        if (reason) newCase.setReason(reason);
        await newCase.send();

        const embed = new MessageEmbed()
            .setColor(MODERATION_LOG_TYPE.WARN.hex)
            .setFooter('TypicalBot', LINK.ICON)
            .setTitle(message.translate('common:ALERT_SYSTEM'))
            .setDescription(message.translate('moderation/warn:WARNED', {
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
        member.send(embed).catch(() => null);

        return message.success(message.translate('moderation/warn:SUCCESS', {
            user: member.user.tag
        }));
    }
}
