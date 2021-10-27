import HandlerCollection from './HandlerCollection';
import {
    BotStatisticsHandler,
    BotStartupHandler,
    BotMentionHandler,
    UserMentionSpamHandler,
    UserMentionSpamHandlerTwo,
    UserCapLockSpamHandler,
    UserZalgoSpamHandler,
    UserZalgoSpamHandlerTwo,
    UserScamLinkSpamHandler, UserScamLinkSpamHandlerTwo
} from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    // Ready
    collection.add('ready', BotStartupHandler);

    // Message Create
    collection.add('messageCreate', BotMentionHandler);
    collection.add('messageCreate', UserCapLockSpamHandler);
    collection.add('messageCreate', UserMentionSpamHandler);
    collection.add('messageCreate', UserScamLinkSpamHandler);
    collection.add('messageCreate', UserZalgoSpamHandler);

    // Message Update
    collection.add('messageUpdate', UserMentionSpamHandlerTwo);
    collection.add('messageUpdate', UserMentionSpamHandlerTwo);
    collection.add('messageUpdate', UserScamLinkSpamHandlerTwo);
    collection.add('messageUpdate', UserZalgoSpamHandlerTwo);

    // Guild Create
    collection.add('guildCreate', BotStatisticsHandler);

    return collection;
};

export {
    handlerMap
};
