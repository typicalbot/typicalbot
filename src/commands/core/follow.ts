import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes, PermissionsLevels } from '../../lib/utils/constants';

export default class extends Command {
    mode = Modes.STRICT;
    permission = PermissionsLevels.SERVER_ADMINISTRATOR;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const [type, id] = parameters.split(' ');
        const channel = message.mentions.channels.first() ?? message.guild.channels.cache.get(id) ?? message.channel;
        const isStatus = type?.toLowerCase() === 'status';

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.client.api.channels(isStatus ? '621817852726607882' : '268559149175013376').followers.post({ data: { webhook_channel_id: channel.id } });
        return message.success(message.translate(isStatus ? 'core/follow:FOLLOWED_STATUS' : 'core/follow:FOLLOWED'));
    }
}
