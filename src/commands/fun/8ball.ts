import { Message } from 'discord.js';
import Command from '../../structures/Command';

const responses = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes, definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook is good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
];

export default class extends Command {
    description = 'Ask the magic 8ball a question.';

    usage = '8ball <question>';

    static execute(message: Message, parameters?: string) {
        if (!parameters) return message.error('Are you trying to ask me nothing?');

        return message.reply(
            responses[Math.floor(Math.random() * responses.length)],
        );
    }
}
