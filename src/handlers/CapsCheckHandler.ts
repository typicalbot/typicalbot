import Handler from '../lib/handler/Handler';
import GuildSettings from '../lib/database/schema/GuildSettings';

const regex = /[A-Z]/g;

const CapsCheckHandler: Handler<'messageCreate'> = async (client, message) => {
    // TODO: Used cache settings instead of calling database every time
    const settings = await client.containers.get('database').get('guilds', { id: message.guild!.id }) as GuildSettings;
    if (!settings || !settings.automod.spam.caps.enabled) return;

    if (regex.test(message.content) && message.deletable) {
        await message.delete();
    }
};

const CapsCheckTwoHandler: Handler<'messageUpdate'> = async (client, oldMessage, newMessage) => {
    const settings = await client.containers.get('database').get('guilds', { id: newMessage.guild!.id }) as GuildSettings;
    if (!settings || !settings.automod.invite) return;

    if (regex.test(newMessage.content!) && newMessage.deletable) {
        await newMessage.delete();
    }
};

export {
    CapsCheckHandler,
    CapsCheckTwoHandler
};
