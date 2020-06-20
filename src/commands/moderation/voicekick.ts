import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes, PermissionsLevels, ModerationLogTypes } from '../../lib/utils/constants';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;

export default class extends Command {
    permission = PermissionsLevels.SERVER_MODERATOR;
    mode = Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: this.client.config.prefix
            }));
        args.shift();

        if (!message.guild.me?.permissions.has('MOVE_MEMBERS', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Move Members'
            }));

        const [userID, reason] = args;

        const member = await message.guild.members
            .fetch(userID)
            .catch(() => null);

        if (!member)
            return message.error(message.translate('common:USER_NOT_FOUND'));
        if (!member.voice.channel)
            return message.error(message.translate('moderation/voicekick:NO_VOICE'));

        const removed = await member.voice
            .setChannel(null, reason || 'No reason provided.')
            .catch(() => null);

        if (!removed) return null;

        if (message.guild.settings.logs.moderation) {
            const newCase = await message.guild.buildModerationLog();
            newCase
                .setAction(ModerationLogTypes.VOICE_KICK)
                .setModerator(message.author)
                .setUser(member.user);
            if (reason) newCase.setReason(reason);
            await newCase.send();
        }

        return message.success(message.translate('moderation/voicekick:SUCCESS', {
            user: member.user.tag
        }));
    }
}
