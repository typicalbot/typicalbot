import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';
import jokes from '../../utility/jokes.json';

export default class extends Command {
    execute(message: TypicalGuildMessage) {
        return message.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
}
