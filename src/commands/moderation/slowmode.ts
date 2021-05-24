import Command from '../../lib/structures/Command';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { TextChannel } from 'discord.js';

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const cooldown = +parameters;

        if (!isFinite(cooldown) || cooldown > 21600) {
            return message.error(message.translate('moderation/slowmode:ERROR'));
        }

        const channel = message.channel as TextChannel;
        await channel.setRateLimitPerUser(cooldown);

        return cooldown === 0
            ? message.send(message.translate('moderation/slowmode:RESET'))
            : message.send(message.translate('moderation/slowmode:SET', { cooldown }));
    }
}
