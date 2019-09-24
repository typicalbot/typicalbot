import { Message } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../structures/Command';

export default class extends Command {
    execute(message: Message) {
        fetch('https://api.adviceslip.com/advice')
            .then((res) => res.json())
            .then((json) => message.send(json.slip.advice))
            .catch(() => message.error(message.translate('common:REQUEST_ERROR')));
    }
}
