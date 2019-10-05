import fetch from 'node-fetch';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['yomomma'];

    execute(message: TypicalGuildMessage) {
        fetch('https://api.yomomma.info')
            .then(res => res.json())
            .then(json => message.send(json.joke))
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR'))
            );
    }
}
