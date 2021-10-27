import HandlerCollection from './HandlerCollection';
import { BotStatisticsHandler, BotStartupHandler, BotMentionHandler } from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    collection.add('messageCreate', BotMentionHandler);
    collection.add('ready', BotStartupHandler);
    collection.add('guildCreate', BotStatisticsHandler);

    return collection;
};

export {
    handlerMap
};
