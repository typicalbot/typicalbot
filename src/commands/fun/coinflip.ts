import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

export default class extends Command {
    execute(message: TypicalGuildMessage) {
        const randomNumber = Math.floor(Math.random() * 2);

        return message.send(message.translate(`fun/coinflip:RESPONSE_${randomNumber + 1}`));
    }
}
