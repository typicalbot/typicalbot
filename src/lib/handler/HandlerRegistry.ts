import HandlerCollection from './HandlerCollection';
import {
    BotStatisticsHandler,
    BotStartupHandler,
    BotMentionHandler,
    UserMentionSpamHandler,
    UserMentionSpamHandlerTwo, UserCapLockSpamHandler, UserZalgoSpamHandler, UserZalgoSpamHandlerTwo
} from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    // Ready
    collection.add('ready', BotStartupHandler);

    // Message Create
    collection.add('messageCreate', BotMentionHandler);
    collection.add('messageCreate', UserCapLockSpamHandler);
    collection.add('messageCreate', UserMentionSpamHandler);
    collection.add('messageCreate', UserZalgoSpamHandler);

    // Message Update
    collection.add('messageUpdate', UserMentionSpamHandlerTwo);
    collection.add('messageUpdate', UserMentionSpamHandlerTwo);
    collection.add('messageUpdate', UserZalgoSpamHandlerTwo);

    // Guild Create
    collection.add('guildCreate', BotStatisticsHandler);

    return collection;
};

export {
    handlerMap
};
