import { Message } from 'discord.js';
import Command from '../../structures/Command'

export default class extends Command {

    static execute(message: Message) {
        const mention = message.mentions.users.first();
        const randomAddon = Math.random() <= 0.25;

        // TODO: fix this if discord.js fixes partials behavior
        if (!mention || mention.id === (message.author && message.author.id)) return message.reply(message.translate('slap:SELF'));

        return message.reply(message.translate(randomAddon ? 'slap:RESPONSE_HURT' : 'slap:RESPONSE', { user: mention }));
    }
};
