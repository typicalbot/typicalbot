/* eslint-disable @typescript-eslint/naming-convention */
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

export default class extends Command {
    mode = MODE.STRICT;
    permission = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const [type, id] = parameters.split(' ');
        const channel = message.mentions.channels.first() ?? message.guild.channels.cache.get(`${BigInt(id)}`) ?? message.channel;
        if (!message.guild.me?.permissions.has('MANAGE_WEBHOOKS', true))
            return message.error(message.translate('common:INSUFFICIENT_PERMISSIONS', {
                permission: 'Manage Webhooks'
            }));

        const webhooks = await message.channel.fetchWebhooks();
        if (webhooks.size >= 10) return message.error(message.translate('general/follow:MAX_WEBHOOK_LIMIT'));

        const isStatus = type?.toLowerCase() === 'status';

        // @ts-ignore
        this.client.api.channels(isStatus ? '621817852726607882' : '268559149175013376').followers.post({ data: { webhook_channel_id: channel.id } });
        return message.success(message.translate(isStatus ? 'general/follow:FOLLOWED_STATUS' : 'general/follow:FOLLOWED'));
    }
}
