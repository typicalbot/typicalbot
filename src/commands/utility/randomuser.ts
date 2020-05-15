import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';

const regex = /(-o(?:nline)?\s)?/i;

export default class extends Command {
    aliases = ['ruser'];
    mode = Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        const role = parameters
            ? message.guild.roles.cache.get(parameters)
                || message.guild.roles.cache.find((role) => role.name.toLowerCase() === parameters.toLowerCase())
            : message.mentions.roles.first();

        const members = role
            ? role.members.filter((m) => !m.user.bot)
            : args
                ? message.guild.members.cache.filter((m) => m.presence.status !== 'offline' && !m.user.bot)
                : message.guild.members.cache.filter((m) => !m.user.bot);

        const member = members.random();

        return message.send(message.translate('utility/randomuser:RANDOM', {
            tag: member.user.tag,
            id: member.id
        }));
    }
}
