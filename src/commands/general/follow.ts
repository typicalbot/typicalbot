import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes, PermissionsLevels } from '../../lib/utils/constants';

export default class extends Command {
    mode = Modes.STRICT;
    permission = PermissionsLevels.SERVER_ADMINISTRATOR;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const [type] = parameters;
        if (!message.guild.me?.permissions.has('MANAGE_WEBHOOKS', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Manage Webhooks'
            }));

        const webhooks = await message.channel.fetchWebhooks();
        if (webhooks.size >= 10) return message.error(message.translate('general/follow:MAX_WEBHOOK_LIMIT'));

        const isStatus = type?.toLowerCase() === 'status';

        await message.followers(isStatus ? '621817852726607882' : '268559149175013376');
        return message.success(message.translate(isStatus ? 'general/follow:FOLLOWED_STATUS' : 'general/follow:FOLLOWED'));
    }
}
