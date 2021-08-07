import { Client, ClientOptions } from 'discord.js';
import ContainerManager from './container/ContainerManager';

class TypicalBotClient extends Client {
    public containers: ContainerManager;

    constructor(options: ClientOptions) {
        super(options);

        this.containers = new ContainerManager();
    }
}

export default TypicalBotClient;
