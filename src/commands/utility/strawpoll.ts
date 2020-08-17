import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

const regex = /(?:(-m)\s+)?(.+)\s+\|\s+(.+)/i;
const splitRegex = /\s*;\s*/i;

export default class extends Command {
    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();
        const [multi, question, answers] = args;

        const list = answers.split(splitRegex);
        if (list.length < 2 || list.length > 30)
            return message.error(message.translate('utility/strawpoll:INVALID'));

        const data = await fetch('https://www.strawpoll.me/api/v2/polls', {
            method: 'post',
            body: JSON.stringify({
                title: question,
                options: list,
                multi: !!multi
            })
        })
            .then((res) => res.json())
            .catch(() => null);
        if (!data)
            return message.error(message.translate('common:REQUEST_ERROR'));

        return message.reply(message.translate('utility/strawpoll:CREATED', { id: data.id }));
    }
}
