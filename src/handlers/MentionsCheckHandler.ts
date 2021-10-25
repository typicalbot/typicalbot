import Handler from '../lib/handler/Handler';
import GuildSettings from '../lib/database/schema/GuildSettings';

const regex = /<@![0-9]{18}>/gm;

const MentionsCheckHandler: Handler<'messageCreate'> = async (client, message) => {
    // TODO: Use cache settings
    const settings = await client.containers.get('database').get('guilds', { id: message.guild!.id }) as GuildSettings;
    if (!settings || !settings.automod.spam.mentions.enabled) return;

    if (regex.test(message.content!) && message.deletable) {
        await message.delete();
    }
};

const MentionsCheckTwoHandler: Handler<'messageUpdate'> = async (client, oldMessage, newMessage) => {
    const settings = await client.containers.get('database').get('guilds', { id: newMessage.guild!.id }) as GuildSettings;
    if (!settings || !settings.automod.invite) return;

    if (regex.test(newMessage.content!) && newMessage.deletable) {
        await newMessage.delete();
    }
};

export {
    MentionsCheckHandler,
    MentionsCheckTwoHandler
};
