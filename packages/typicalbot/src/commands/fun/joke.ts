import { Message } from 'discord.js';
import Command from '../../structures/Command';
import * as jokes from '../../utility/jokes.json';

export default class extends Command {
    execute(message: Message) {
        return message.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
}
