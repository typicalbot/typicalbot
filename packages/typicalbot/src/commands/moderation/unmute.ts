import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import {
    TypicalGuildMessage,
    TaskOptions,
    UnmuteTaskData
} from '../../types/typicalbot';
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

        const role =
            message.guild.settings.roles.mute &&
            message.guild.roles.get(message.guild.settings.roles.mute);
        if (!message.guild.settings.roles.mute || !role)
            return message.error(message.translate('mute:NO_ROLE'));

        if (!member.roles.has(message.guild.settings.roles.mute))
            return message.error(message.translate('unmute:NOT_MUTED'));

        if (
            message.member.roles.highest.position <=
                member.roles.highest.position &&
            (permissionLevel.level !== 4 && permissionLevel.level < 9)
        )
            return message.error(message.translate('unmute:TOO_LOW'));

        if (!role.editable)
            return message.error(message.translate('mute:UNEDITABLE'));

        const embed = new MessageEmbed()
            .setColor(0xff9900)
            .setFooter('TypicalBot', Constants.Links.ICON)
            .setTitle(message.translate('common:ALERT_SYSTEM'))
            .setDescription(
                message.translate('unmute:UNMUTED', {
                    name: message.guild.name
                })
            )
            .addField(
                message.translate('common:MODERATOR_FIELD'),
                message.author.tag
            );
        if (reason)
            embed.addField(message.translate('common:REASON_FIELD'), reason);

        member.send().catch(() => null);

        const unmuted = await member.roles.remove(role).catch(() => null);
        if (!unmuted) return message.error('unmute:ERROR');

        if (message.guild.settings.logs.moderation) {
            const newCase = await message.guild.buildModerationLog(message);
            newCase
                .setAction(Constants.ModerationLogTypes.UNMUTE)
                .setModerator(message.author)
                .setUser(member.user);
            if (reason) newCase.setReason(reason);
            newCase.send();

            const tasks = (await this.client.handlers.database
                .get('tasks')
                .catch(() => [])) as TaskOptions[];
            const releventTask = tasks.find(
                task =>
                    task.type === 'unmute' &&
                    (task.data as UnmuteTaskData).guildID ===
                        message.guild.id &&
                    (task.data as UnmuteTaskData).memberID === member.id
            );
            if (releventTask)
                this.client.handlers.tasks.delete(releventTask.id);
        }

        return message.success(
            message.translate('unmute:SUCCESS', { user: member.user.tag })
        );
    }
}
