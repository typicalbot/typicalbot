import { Client, ClientOptions, Collection } from 'discord.js';
import ContainerManager from './container/ContainerManager';
import Command from './command/Command';
import { commandMap } from '../commands';

class TypicalBotClient extends Client {
    public containers: ContainerManager;
    public commands: Collection<string, Command> = commandMap();

    constructor(options: ClientOptions) {
        super(options);

        this.containers = new ContainerManager();
    }
}

export default TypicalBotClient;
