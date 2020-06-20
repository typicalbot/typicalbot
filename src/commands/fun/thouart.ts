import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

export default class extends Command {
    execute(message: TypicalGuildMessage) {
        fetch('https://quandyfactory.com/insult/json', { headers: { 'Accept': 'application/json' } })
            .then((res) => res.json())
            .then((json) => message.send(json.insult))
            .catch(() => message.error(message.translate('common:REQUEST_ERROR')));
    }
}
