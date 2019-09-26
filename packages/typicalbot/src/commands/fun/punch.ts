import { Message } from 'discord.js';
import Command from '../../structures/Command'

export default class extends Command {

    static execute(message: Message) {
        const mention = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        // TODO: fix this if discord.js fixes partials behavior
        if (!mention || mention.id === (message.author && message.author.id)) return message.reply(message.translate('punch:SELF'));

        return message.reply(message.translate(randomAddon ? 'punch:RESPONSE_JAW' : 'punch:RESPONSE', { user: mention }));
    }
};
