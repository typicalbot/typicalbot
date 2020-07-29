import Command from '../../lib/structures/Command';
import { TypicalMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';

export default class extends Command {
    dm = true;
    mode = Modes.STRICT;

    async execute(message: TypicalMessage) {
        const ping = await message.send(message.translate('general/ping:CALCULATING'));

        return ping.edit(message.translate('general/ping:RESPONSE', {
            command: ping.createdTimestamp - message.createdTimestamp,
            api: Math.floor(this.client.ws.ping)
        }));
    }
}
