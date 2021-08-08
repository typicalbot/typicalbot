import Handler from '../lib/handler/Handler';

const InviteCheckHandler: Handler<'messageCreate'> = async (client, message) => {
    // Check guild permissions

    const regex = /(discord\.(gg|io|me|li|plus|link)\/.+|discord(?:app)?\.com\/invite\/.+)/i;

    if (regex.test(message.content) && message.deletable) {
        await message.delete();

        // Create log entry
    }
};

export default InviteCheckHandler;
