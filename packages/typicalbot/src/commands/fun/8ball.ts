import { Message } from 'discord.js';
import Command from '../../structures/Command';

export default class extends Command {
    execute(message: Message, parameters?: string) {
        if (!parameters) return message.error(message.translate('8ball:INVALID'));

        const randomNumber = Math.floor(Math.random() * 20);

        return message.reply(message.translate(`8ball:RESPONSE_${randomNumber}`));
    }
}
