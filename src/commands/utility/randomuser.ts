import Command from '../../lib/structures/Command';
import { Modes } from '../../lib/utils/constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(-o(?:nline)?\s)?/i;

export default class extends Command {
    aliases = ['ruser'];
    mode = Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);

        const members = args
            ? message.guild.members.cache.filter((m) => m.presence.status !== 'offline' && !m.user.bot)
            : message.guild.members.cache.filter((m) => !m.user.bot);
        if (!members.size) return null;

        const member = members.random();

        return message.send(message.translate('utility/randomuser:RANDOM', {
            tag: member.user.tag,
            id: member.id
        }));
    }
}
