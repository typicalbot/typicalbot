import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';
import PermissionLevel from '../../structures/PermissionLevel';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(\d+))?(?:\s+(.+))?/i;

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
    mode = Constants.Modes.STRICT;

    async execute(
        message: TypicalGuildMessage,
        parameters: string,
        permissionLevel: PermissionLevel
    ) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(
                message.translate('misc:USAGE_ERROR', {
                    name: this.name,
                    prefix: this.client.config.prefix
                })
            );
        args.shift();

        const [userID, days, reason] = args;

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
            return message.error(message.translate('moderation/ban:TOO_LOW'));
        if (!member.bannable)
            return message.error(
                message.translate('moderation/ban:UNBANNABLEs')
            );

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
            await message.guild.members.unban(userID, banReason);

            if (!message.guild.settings.logs.moderation) {
                const newCase = await message.guild.buildModerationLog();
                newCase
                    .setAction(Constants.ModerationLogTypes.SOFTBAN)
                    .setModerator(message.author)
                    .setUser(member.user);
                if (reason) newCase.setReason(reason);
                newCase.send();
            }

            return message.success(
                message.translate('moderation/softban:BANNED', {
                    user: member.user.tag
                })
            );
        }, 1000);
    }
}
