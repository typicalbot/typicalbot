import { Client, ClientOptions } from 'discord.js';
import ContainerManager from './container/ContainerManager';
import CommandCollection from './command/CommandCollection';
import { commandMap } from './command/CommandRegistry';
import HandlerCollection from './handler/HandlerCollection';
import { handlerMap } from './handler/HandlerRegistry';

class TypicalBotClient extends Client {
    public containers: ContainerManager;
    public commands: CommandCollection = commandMap();
    public handlers: HandlerCollection = handlerMap();

    constructor(options: ClientOptions) {
        super(options);

        this.containers = new ContainerManager();

        this.registerEvents();
    }

    registerEvents() {
        this.handlers.forEach((value, key) => {
            if (key === 'ready') {
                this.once(key, (...args) => {
                    for (const handler of value) {
                        handler(this, ...args);
                    }
                });
            } else {
                this.on(key, (...args) => {
                    for (const handler of value) {
                        handler(this, ...args);
                    }
                });
            }
        });
    }
}

export default TypicalBotClient;
