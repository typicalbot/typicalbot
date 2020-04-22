import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    execute(message: TypicalGuildMessage, parameters?: string) {
        if (!parameters)
            return message.error(message.translate('fun/8ball:INVALID'));

        const randomNumber = Math.floor(Math.random() * 20);

        return message.reply(message.translate(`fun/8ball:RESPONSE_${randomNumber + 1}`));
    }
}
