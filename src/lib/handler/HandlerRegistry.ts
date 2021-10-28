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
    UserScamLinkSpamHandler,
    UserScamLinkSpamHandlerTwo,
    BotDMCommandHandler,
    BotStarboardHandler,
    BotStarboardHandlerTwo
} from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    // Ready
    collection.add('ready', BotStartupHandler);

    // Message Create
    collection.add('messageCreate', BotDMCommandHandler);
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

    // Message Reaction Add
    collection.add('messageReactionAdd', BotStarboardHandler);

    // Message Reaction Remove
    collection.add('messageReactionRemove', BotStarboardHandlerTwo);

    // Guild Create
    collection.add('guildCreate', BotStatisticsHandler);

    return collection;
};

export {
    handlerMap
};
