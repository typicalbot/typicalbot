import { Collection } from 'discord.js';
import Command from './Command';

class CommandCollection extends Collection<string, Command> {
    add(command: Command) {
        super.set(command.options.name, command);
    }
}

export default CommandCollection;
