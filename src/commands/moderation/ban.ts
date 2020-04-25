import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage, PermissionLevel } from '../../lib/types/typicalbot';
import { Modes, PermissionsLevels, Links } from '../../lib/utils/constants';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(?:(\d+)d(?:ays?)?)?\s?(?:(\d+)h(?:ours?|rs?)?)?\s?(?:(\d+)m(?:inutes?|in)?)?\s?(?:(\d+)s(?:econds?|ec)?)?)?(?:\s*(\d+))?(?:\s*(.+))?/i;

export default class extends Command {
    permission = PermissionsLevels.SERVER_MODERATOR;
    mode = Modes.STRICT;

    async execute(message: TypicalGuildMessage,
        parameters?: string,
        permissionLevel?: PermissionLevel) {
        const usageError = message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: this.client.config.prefix
        });
        if (!parameters || !permissionLevel) return message.error(usageError);

        const args = regex.exec(parameters);
        if (!args) return message.error(usageError);
        args.shift();

        const [userID, days, hours, minutes, seconds, purgeDays, reason] = args;

        const time =
            (60 * 60 * 24 * (days ? Number(days) : 0) +
                60 * 60 * (hours ? Number(hours) : 0) +
                60 * (minutes ? Number(minutes) : 0) +
                (seconds ? Number(seconds) : 0)) *
            1000;

        if (time > 1000 * 60 * 60 * 24 * 7)
            return message.error(message.translate('moderation/ban:WEEK'));

        const user = await this.client.users.fetch(userID).catch(() => null);
        if (!user)
            return message.error(message.translate('common:USER_FETCH_ERROR'));

        const member = await message.guild.members
            .fetch(user)
            .catch(() => null);
        if (
            member &&
            message.member.roles.highest.position <=
                member.roles.highest.position &&
            permissionLevel.level !== 4 &&
            permissionLevel.level < 9
        )
            return message.error(message.translate('moderation/ban:TOO_LOW'));

        if (member && !member.bannable)
            return message.error(message.translate('moderation/ban:UNBANNABLE'));

        const log = {
            expiration: time,
            moderator: message.author,
            reason
        };

        this.client.caches.bans.set(user.id, log);

        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setFooter('TypicalBot', Links.ICON)
            .setTitle(message.translate('common:ALERT_SYSTEM'))
            .setDescription(message.translate('moderation/ban:BANNED', {
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

        await user.send(embed).catch(() => null);

        await message.guild.members
            .ban(user, {
                days: parseInt(purgeDays, 10) || 0,
                reason: message.translate('moderation/ban:REASON', {
                    mod: message.author.tag,
                    reason: reason || message.translate('common:NO_REASON')
                })
            })
            .catch((err) => {
                if (err === "Error: Couldn't resolve the user ID to ban.")
                    return message.error(message.translate('common:USER_NOT_FOUND'));

                this.client.caches.bans.delete(user.id);

                return message.error(message.translate('moderation/ban:ERROR'));
            });

        if (time)
            await this.client.handlers.tasks.create('unban', Date.now() + time, {
                guildID: message.guild.id,
                userID: user.id
            });

        return message.success(message.translate('moderation/ban:BAN_SUCCESS', { user: user.tag }));
    }
}
