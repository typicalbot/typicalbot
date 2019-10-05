import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    execute(message: TypicalGuildMessage, parameters?: string) {
        if (!parameters)
            return message.error(message.translate('8ball:INVALID'));

        const randomNumber = Math.floor(Math.random() * 20);

        return message.reply(
            message.translate(`8ball:RESPONSE_${randomNumber}`)
        );
    }
}
