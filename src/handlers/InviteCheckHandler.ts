import Handler from '../lib/handler/Handler';
import GuildSettings from '../lib/database/schema/GuildSettings';

const regex = /(discord\.(gg|io|me|li|plus|link)\/.+|discord(?:app)?\.com\/invite\/.+)/i;

const InviteCheckHandler: Handler<'messageCreate'> = async (client, message) => {
    // TODO: Use cached settings instead of calling database every time
    const settings = await client.containers.get('database').get('guilds', { id: message.guild!.id }) as GuildSettings;
    if (!settings || !settings.automod.invite) return;

    if (regex.test(message.content) && message.deletable) {
        await message.delete();

        // Create log entry
    }
};

const InviteCheckTwoHandler: Handler<'messageUpdate'> = async (client, oldMessage, newMessage) => {
    const settings = await client.containers.get('database').get('guilds', { id: newMessage.guild!.id }) as GuildSettings;
    if (!settings || !settings.automod.invite) return;

    if (regex.test(newMessage.content!) && newMessage.deletable) {
        await newMessage.delete();
    }
};

export {
    InviteCheckHandler,
    InviteCheckTwoHandler
};
