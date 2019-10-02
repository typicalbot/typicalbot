import Command from '../../structures/Command';
import { GuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['die'];

    execute(message: GuildMessage, parameters = '6') {
        const sides = +parameters || 6;

        if (sides < 2 || sides > 100 || sides % 1 !== 0)
            return message.error('dice:INVALID');

        return message.reply(
            message.translate('dice:RESPONSE', {
                amount: Math.floor(Math.random() * sides) + 1
            })
        );
    }
}
