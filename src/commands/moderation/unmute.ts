import { MessageEmbed } from 'discord.js';
import Command from '../../lib/structures/Command';
import PermissionLevel from '../../lib/structures/PermissionLevel';
import {
    TypicalGuildMessage,
    TaskOptions,
    UnmuteTaskData
} from '../../lib/types/typicalbot';
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

        if (!message.guild.me?.permissions.has('MANAGE_ROLES', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Manage Roles'
            }));

        const [userID, reason] = args;

        const member = await message.guild.members
            .fetch(userID)
            .catch(() => null);
        if (!member)
            return message.error(message.translate('common:USER_NOT_FOUND'));

        const role =
            message.guild.settings.roles.mute &&
            message.guild.roles.cache.get(message.guild.settings.roles.mute);
        if (!message.guild.settings.roles.mute || !role)
            return message.error(message.translate('moderation/mute:NO_ROLE'));

        if (!member.roles.cache.has(message.guild.settings.roles.mute))
            return message.error(message.translate('moderation/unmute:NOT_MUTED'));

        if (
            message.member.roles.highest.position <=
            member.roles.highest.position &&
            permissionLevel.level !== 4 &&
            permissionLevel.level < 9
        )
            return message.error(message.translate('moderation/unmute:TOO_LOW'));

        if (!role.editable)
            return message.error(message.translate('moderation/mute:UNEDITABLE'));

        const embed = new MessageEmbed()
            .setColor(0xff9900)
            .setFooter('TypicalBot', LINK.ICON)
            .setTitle(message.translate('common:ALERT_SYSTEM'))
            .setDescription(message.translate('moderation/unmute:UNMUTED', {
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

        const unmuted = await member.roles.remove(role).catch(() => null);
        if (!unmuted) return message.error(message.translate('moderation/unmute:ERROR'));

        if (message.guild.settings.logs.moderation) {
            const newCase = await message.guild.buildModerationLog();
            newCase
                .setAction(MODERATION_LOG_TYPE.UNMUTE)
                .setModerator(message.author)
                .setUser(member.user);
            if (reason) newCase.setReason(reason);
            await newCase.send();

            const tasks = (await this.client.handlers.database
                .get('tasks')) as TaskOptions[];
            const releventTask = tasks.find((task) =>
                task.type === 'unmute' &&
                (task.data as UnmuteTaskData).guildID ===
                message.guild.id &&
                (task.data as UnmuteTaskData).memberID === member.id);
            if (releventTask)
                await this.client.handlers.tasks.delete(releventTask.id);
        }

        return message.success(message.translate('moderation/unmute:SUCCESS', {
            user: member.user.tag
        }));
    }
}
