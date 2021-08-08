import HandlerCollection from './HandlerCollection';
import { SlashCommandHandler, StartupHandler } from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    collection.add('interactionCreate', SlashCommandHandler);
    collection.add('ready', StartupHandler);

    return collection;
};

export {
    handlerMap
};
