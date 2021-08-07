import Command from '../../lib/structures/Command';
import PermissionLevel from '../../lib/structures/PermissionLevel';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL, MODERATION_LOG_TYPE } from '../../lib/utils/constants';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(\d+))?(?:\s+(.+))?/i;

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage,
        parameters: string,
        permissionLevel: PermissionLevel) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();

        if (!message.guild.me?.permissions.has('BAN_MEMBERS', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Ban Members'
            }));

        const [userID, days, reason] = args;

        const member = await message.guild.members
            .fetch(`${BigInt(userID)}`)
            .catch(() => null);
        if (!member)
            return message.error(message.translate('common:USER_NOT_FOUND'));

        if (
            message.member.roles.highest.position <=
            member.roles.highest.position &&
            permissionLevel.level !== 4 &&
            permissionLevel.level < 9
        )
            return message.error(message.translate('moderation/ban:TOO_LOW'));
        if (!member.bannable)
            return message.error(message.translate('moderation/ban:UNBANNABLE'));

        this.client.caches.softbans.set(userID, userID);

        const banReason = message.translate('moderation/softban:REASON', {
            mod: message.author.tag,
            reason: reason || message.translate('common:NO_REASON')
        });

        const banned = await member.ban({
            days: parseInt(days, 10) || 2,
            reason: banReason
        });

        if (!banned)
            return message.error(message.translate('common:REQUEST_ERROR'));

        return setTimeout(async () => {
            await message.guild.members.unban(`${BigInt(userID)}`, banReason);

            if (!message.guild.settings.logs.moderation) {
                const newCase = await message.guild.buildModerationLog();
                newCase
                    .setAction(MODERATION_LOG_TYPE.SOFTBAN)
                    .setModerator(message.author)
                    .setUser(member.user);
                if (reason) newCase.setReason(reason);
                await newCase.send();
            }

            return message.success(message.translate('moderation/softban:BANNED', {
                user: member.user.tag
            }));
        }, 1000);
    }
}
