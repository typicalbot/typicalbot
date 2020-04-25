import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['dadjoke'];

    execute(message: TypicalGuildMessage) {
        fetch('https://icanhazdadjoke.com', { headers: { 'Accept': 'application/json' } })
            .then((res) => res.json())
            .then((json) => message.send(json.joke))
            .catch(() => message.error(message.translate('common:REQUEST_ERROR')));
    }
}
