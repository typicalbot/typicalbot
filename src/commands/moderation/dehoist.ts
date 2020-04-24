import { Modes, PermissionsLevels } from '../../lib/utils/constants';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

const characters = [
    '!',
    '"',
    '#',
    '$',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    '[',
    ']'
];

export default class extends Command {
    permission = PermissionsLevels.SERVER_ADMINISTRATOR;
    mode = Modes.STRICT;

    async execute(message: TypicalGuildMessage) {
        const list = [];
        for (const member of message.guild.members.cache.values()) {
            if (!characters.includes(member.displayName[0])) continue;
            list.push(`» ${member.displayName} (${member.id})`);
        }

        await message.send(list.length
            ? [
                message.translate('moderation/dehoist:FOUND', {
                    amount: message.translate(list.length === 1
                        ? 'moderation/dehoist:ONE'
                        : 'moderation/dehoist:MULTIPLE', { amount: list.length })
                }),
                '',
                list.join('\n\n').substring(0, 2000)
            ].join('\n')
            : message.translate('moderation/dehoist:NONE'));
    }
}
