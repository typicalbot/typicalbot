import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i;

export default class extends Command {
    permission = Constants.PermissionsLevels.SERVER_MODERATOR;
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
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
        if (!member.voice.channel)
            return message.error(message.translate('voicekick:NO_VOICE'));

        const removed = await member.voice
            .setChannel(null, reason || 'No reason provided.')
            .catch(() => null);

        if (!removed) return null;

        if (message.guild.settings.logs.moderation) {
            const newCase = await message.guild.buildModerationLog();
            newCase
                .setAction(Constants.ModerationLogTypes.VOICE_KICK)
                .setModerator(message.author)
                .setUser(member.user);
            if (reason) newCase.setReason(reason);
            newCase.send();
        }

        return message.success(
            message.translate('voicekick:SUCCESS', { user: member.user.tag })
        );
    }
}
