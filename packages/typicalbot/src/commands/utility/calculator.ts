import math from 'mathjs';
import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['calc', 'math'];
    mode = Constants.Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        if (!parameters) return message.error(message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: this.client.config.prefix
        }));

        try {
            const result = math.evaluate(parameters);

            return message.send(
                [
                    message.translate('calculator:INPUT'),
                    '```',
                    parameters,
                    '```',
                    message.translate('calculator:OUTPUT'),
                    '```',
                    result,
                    '```',
                ].join('\n')
            );
        } catch (e) {
            return message.error(message.translate('calculator:FAILED'));
        }
    }
};
