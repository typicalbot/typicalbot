import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage, PermissionLevel } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL, MODERATION_LOG_TYPE, LINK } from '../../lib/utils/constants';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;
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

        if (!message.guild.me?.permissions.has('KICK_MEMBERS', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Kick Members'
            }));

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
            .setFooter('TypicalBot', LINK.ICON)
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
                .setAction(MODERATION_LOG_TYPE.KICK)
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
