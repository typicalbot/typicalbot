import Handler from '../lib/handler/Handler';

const MessageCommandHandler: Handler<'messageCreate'> = async (client, message) => {
    if (message.author.bot || message.webhookId || message.partial) return;
    if (message.channel.type === 'DM') return;
    if (!message.guild?.available) return;

    const raw = message.content.split(' ')[0];
    const prefix = '$';

    if (!raw.startsWith(prefix)) return;

    const commandName = raw.slice(prefix.length).toLowerCase();
    const commandExists = client.commands.has(commandName);

    if (commandExists) {
        await message.reply('TypicalBot has moved to slash commands and discontinued message commands. This notice will be removed in the future.');
    }
};

export default MessageCommandHandler;
