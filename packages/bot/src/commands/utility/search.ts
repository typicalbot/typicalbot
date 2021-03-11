import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE } from '../../lib/utils/constants';
import { pagify } from '../../lib/utils/util';

const regex = /(\S+)(?:\s+(\d+))?/i;

export default class extends Command {
    mode = MODE.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();

        const [query, number] = args;
        const page = number ? parseInt(number, 10) : 1;
        const lowerQuery = query.toLowerCase();

        const list = message.guild.members.cache.filter((m) =>
            [
                m.user.username.toLowerCase(),
                m.nickname ? m.nickname.toLowerCase() : ''
            ].includes(lowerQuery));

        if (!list.size)
            return message.reply(message.translate('utility/search:NONE', { query }), { allowedMentions: { parse: [] } });

        const content = pagify(message, list.map((m) =>
            `${`${m.user.username}${
                m.nickname ? ` (${m.nickname})` : ''
            }`.padEnd(40)}: ${m.id}`), page);

        return message.send([
            message.translate('utility/search:RESULTS', { query }),
            '',
            '```autohotkey',
            content,
            '```'
        ].join('\n'), undefined, { allowedMentions: { parse: [] } });
    }
}
