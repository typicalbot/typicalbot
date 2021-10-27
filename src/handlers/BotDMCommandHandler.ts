import Handler from '../lib/handler/Handler';
import { PERMISSION_LEVEL } from '../lib/utils/constants';

const BotDMCommandHandler: Handler<'messageCreate'> = (client, message) => {
    if (message.author.bot || message.webhookID || message.partial) return;
    if (message.channel.type !== 'dm') return;
    if (!message.content.startsWith(process.env.PREFIX!)) return;

    const command = client.commands.get(message.content.split(' ')[0].slice(process.env.PREFIX!.length));
    if (!command || !command.dm || command.permission > PERMISSION_LEVEL.SERVER_MEMBER) return;

    command.execute(message);
};

export default BotDMCommandHandler;
