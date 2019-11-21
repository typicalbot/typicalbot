import Command from '../../structures/Command';
import jokes from '../../utility/jokes.json';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    execute(message: TypicalGuildMessage) {
        return message.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
}
