import Command from '../../structures/Command';
import * as jokes from '../../utility/jokes.json';
import { GuildMessage } from '../../types/typicalbot';

export default class extends Command {
    execute(message: GuildMessage) {
        return message.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
}
