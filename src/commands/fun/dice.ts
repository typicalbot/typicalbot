import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['die'];

    execute(message: TypicalGuildMessage, parameters = '6') {
        const sides = +parameters || 6;

        if (sides < 2 || sides > 100 || sides % 1 !== 0)
            return message.error(message.translate('fun/dice:INVALID'));

        return message.reply(message.translate('fun/dice:RESPONSE', {
            amount: Math.floor(Math.random() * sides) + 1
        }));
    }
}
