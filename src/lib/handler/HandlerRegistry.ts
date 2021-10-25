import HandlerCollection from './HandlerCollection';
import {
    CapsCheckHandler,
    CapsCheckTwoHandler,
    InviteCheckHandler,
    InviteCheckTwoHandler,
    MentionsCheckHandler,
    MentionsCheckTwoHandler,
    MessageCommandHandler,
    SlashCommandHandler,
    StartupHandler
} from '../../handlers';

const handlerMap = (): HandlerCollection => {
    const collection = new HandlerCollection();

    collection.add('messageCreate', CapsCheckHandler);
    collection.add('messageUpdate', CapsCheckTwoHandler);
    collection.add('messageCreate', InviteCheckHandler);
    collection.add('messageUpdate', InviteCheckTwoHandler);
    collection.add('messageCreate', MentionsCheckHandler);
    collection.add('messageUpdate', MentionsCheckTwoHandler);
    collection.add('messageCreate', MessageCommandHandler);
    collection.add('interactionCreate', SlashCommandHandler);
    collection.add('ready', StartupHandler);

    return collection;
};

export {
    handlerMap
};
