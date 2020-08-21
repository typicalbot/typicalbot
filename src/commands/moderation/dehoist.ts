import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { MODE, PERMISSION_LEVEL } from '../../lib/utils/constants';

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
    permission = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;
    mode = MODE.STRICT;

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
