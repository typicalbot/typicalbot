import HandlerCollection from './HandlerCollection';
import { BotStatisticsHandler, BotStartupHandler } from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    collection.add('guildCreate', BotStatisticsHandler);
    collection.add('ready', BotStartupHandler);

    return collection;
};

export {
    handlerMap
};
