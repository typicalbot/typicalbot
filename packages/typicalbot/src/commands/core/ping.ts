import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalMessage } from '../../types/typicalbot';

export default class extends Command {
    dm = true;
    mode = Constants.Modes.STRICT;

    async execute(message: TypicalMessage) {
        const ping = await message.send('ping:CALCULATING');

        return ping.edit(
            message.translate('ping:RESPONSE', {
                command: ping.createdTimestamp - message.createdTimestamp,
                api: Math.floor(this.client.ws.ping)
            })
        );
    }
}
