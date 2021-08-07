import { evaluate } from 'mathjs';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE } from '../../lib/utils/constants';

export default class extends Command {
    aliases = ['calc', 'math'];
    mode = MODE.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        if (!parameters)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));

        try {
            const result = evaluate(parameters);

            return message.send([
                message.translate('utility/calculator:INPUT'),
                '```',
                parameters,
                '```',
                message.translate('utility/calculator:OUTPUT'),
                '```',
                result,
                '```'
            ].join('\n'));
        } catch (e) {
            return message.error(message.translate('utility/calculator:FAILED'));
        }
    }
}
