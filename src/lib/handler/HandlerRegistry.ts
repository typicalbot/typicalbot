import HandlerCollection from './HandlerCollection';
import { BotStatisticsHandler, StartupHandler } from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    collection.add('guildCreate', BotStatisticsHandler);
    collection.add('ready', StartupHandler);

    return collection;
};

export {
    handlerMap
};
