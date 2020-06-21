import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';
import { Modes } from '../../lib/utils/constants';

const regex = /#?(\d{4})(?:\s+(\d+))?/i;

export default class extends Command {
    aliases = ['discrim'];
    mode = Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) ?? [];
        args.shift();
        const [userDiscriminator, number] = args;
        const discriminator = userDiscriminator || message.author.discriminator;
        const page = number ? parseInt(number, 10) : 1;

        const list = this.client.users.cache.filter((user) => user.discriminator === discriminator);
        if (!list.size)
            return message.reply(message.translate('utility/discriminator:NONE', {
                discriminator
            }));

        const content = this.client.helpers.pagify.execute(message, list
            .map((u) => `${u.tag.padEnd(30)} ${u.id}`), page);

        return message.send([
            message.translate('utility/discriminator:USERS', {
                discriminator
            }),
            '',
            '```autohotkey',
            content,
            '```'
        ].join('\n'));
    }
}
