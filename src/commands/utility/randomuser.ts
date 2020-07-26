import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';

export default class extends Command {
    aliases = ['ruser'];
    mode = Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = parameters.split(' ');
        const [number] = args;
        const amount = number ? Number(number) : undefined;
        if (amount) args.shift();

        const roleInfo = args.join(' ').toLowerCase();
        const role = roleInfo
            ? message.guild.roles.cache.get(roleInfo)
                ?? message.guild.roles.cache.find((role) => role.name.toLowerCase() === roleInfo)
            : message.mentions.roles.first();

        const members = role
            ? role.members.filter((m) => !m.user.bot)
            : ['-o', '-online'].includes(parameters)
                ? message.guild.members.cache.filter((m) => m.presence.status !== 'offline' && !m.user.bot)
                : message.guild.members.cache.filter((m) => !m.user.bot);

        if (!amount || amount === 1) {
            const member = members.random();

            return message.send(message.translate('utility/randomuser:RANDOM', {
                tag: member.user.tag,
                id: member.id
            }));
        }

        const userIDs = new Set<string>();
        const details: string[] = [];
        if (amount > 10) {
            return message.error(message.translate('utility/randomuser:MAXED'));
        }
        // Max we allow is 10 random users
        while (details.length < amount && details.length < 10) {
            // If the array already has all members possible
            if (details.length === members.size) break;

            const member = members.random();
            // Pick unique users
            if (userIDs.has(member.id)) continue;

            userIDs.add(member.id);

            details.push(`**${member.user.tag}** (${member.id})`);
        }

        return message.send(`${message.translate('utility/randomuser:MULTIPLE_RANDOM')}\n${details.join('\n')}`);
    }
}
