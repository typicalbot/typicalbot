import { Message } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../structures/Command';

export default class extends Command {
    aliases = ['yomomma'];

    static execute(message: Message) {
        fetch('https://api.yomomma.info')
            .then((res) => res.json())
            .then((json) => message.send(json.joke))
            .catch(() => message.error(message.translate('common:REQUEST_ERROR')));
    }
};
