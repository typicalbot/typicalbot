import fetch from 'node-fetch';
import Command from '../../structures/Command';
import { CarboniteBots } from '../../types/apis';
import { TypicalGuildMessage } from '../../types/typicalbot';
import Constants from '../../utility/Constants';

const regex = /(\d+)?/i;
const replaceFirstRegex = /[^a-z0-9]/gim;
const replaceSecondRegex = /\s+/g;

export default class extends Command {
    mode = Constants.Modes.LITE;

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) || [];
        args.shift();
        const [number] = args;

        const data = (await fetch('https://www.carbonitex.net/discord/api/listedbots')
            .then((res) => res.json())
            .catch(() => null)) as CarboniteBots[] | null;
        if (!data) return message.error('common:REQUEST_ERROR');

        const page = number ? parseInt(number, 10) : 1;

        const bots = data
            .filter((bot) =>
                parseInt(bot.botid, 10) > 10 &&
                    parseInt(bot.servercount, 10) > 0)
            .sort((a, b) =>
                parseInt(b.servercount, 10) - parseInt(a.servercount, 10))
            .map((bot) => ({
                ...bot,
                name: bot.name
                    .replace(replaceFirstRegex, '')
                    .replace(replaceSecondRegex, ''),
                servercount: Number(bot.servercount).toLocaleString()
            }));

        const content = this.client.helpers.pagify.execute(message, bots.map((bot) =>
            `${bot.name.padEnd(20)}: ${bot.servercount}${
                bot.compliant
                    ? message.translate('utility/bots:COMPLIANT')
                    : ''
            }`), page);

        return message.send([
            message.translate('utility/bots:RANKED'),
            '```autohotkey',
            content,
            '```'
        ].join('\n'));
    }
}
