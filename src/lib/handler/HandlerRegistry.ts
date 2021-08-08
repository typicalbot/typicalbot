import HandlerCollection from './HandlerCollection';
import { InviteCheckHandler, MessageCommandHandler, SlashCommandHandler, StartupHandler } from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    collection.add('messageCreate', InviteCheckHandler);
    collection.add('messageCreate', MessageCommandHandler);
    collection.add('interactionCreate', SlashCommandHandler);
    collection.add('ready', StartupHandler);

    return collection;
};

export {
    handlerMap
};
