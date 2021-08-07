import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

const regex = /(\d+|latest)(?:\s+(.+))/i;

export default class extends Command {
    permission = PERMISSION_LEVEL.SERVER_MODERATOR;
    mode = MODE.STRICT;

    async execute(message: TypicalGuildMessage, parameters: string) {
        if (!message.guild.settings.logs.moderation)
            return message.error(message.translate('moderation/reason:DISABLED'));

        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();

        const [id, reason] = args;

        const log = (await this.client.handlers.moderationLog.fetchCase(message.guild, id)) as TypicalGuildMessage;

        if (!log)
            return message.error(message.translate('moderation/reason:NONE'));

        const edited = await this.client.handlers.moderationLog
            .edit(log, message.author, reason)
            .catch(() => null);

        if (!edited)
            return message.error(message.translate('moderation/reason:ERROR'));

        const response = await message
            .reply(message.translate('moderation/reason:EDITED'))
            .catch(() => null);
        if (!response) return null;

        if (message.deletable) await message.delete();
        return response.delete();
    }
}
