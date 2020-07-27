import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';

const regex = /(\S+)(?:\s+(\d+))?/i;

export default class extends Command {
    mode = Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: this.client.config.prefix
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
            return message.reply(message.translate('utility/search:NONE', { query }), { allowedMentions: { parse: [] }});

        const content = this.client.helpers.pagify.execute(message, list.map((m) =>
            `${`${m.user.username}${
                m.nickname ? ` (${m.nickname})` : ''
            }`.padEnd(40)}: ${m.id}`), page);

        return message.send([
            message.translate('utility/search:RESULTS', { query }),
            '',
            '```autohotkey',
            content,
            '```'
        ].join('\n'), undefined, { allowedMentions: { parse: [] }});
    }
}
