import HandlerCollection from './HandlerCollection';
import {
    BotStatisticsHandler,
    BotStartupHandler,
    BotMentionHandler,
    UserMentionSpamHandler,
    UserMentionSpamHandlerTwo
} from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    // Ready
    collection.add('ready', BotStartupHandler);

    // Message Create
    collection.add('messageCreate', BotMentionHandler);
    collection.add('messageCreate', UserMentionSpamHandler);

    // Message Update
    collection.add('messageUpdate', UserMentionSpamHandlerTwo);

    // Guild Create
    collection.add('guildCreate', BotStatisticsHandler);

    return collection;
};

export {
    handlerMap
};
