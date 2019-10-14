import Command from '../../structures/Command';
import Constants from '../../utility/Constants';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /#?(\d{4})(?:\s+(\d+))?/i;

export default class extends Command {
    aliases = ['discrim'];
    mode = Constants.Modes.LITE;

    execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters) || [];
        args.shift();
        const [userDiscriminator, number] = args;
        const discriminator = userDiscriminator || message.author.discriminator;
        const page = number ? parseInt(number, 10) : 1;

        const list = this.client.users.filter(
            user => user.discriminator === discriminator
        );
        if (!list.size)
            return message.reply(
                message.translate('utility/discriminator:NONE', {
                    discriminator
                })
            );

        const content = this.client.helpers.pagify.execute(
            message,
            list.map(u => `${u.tag.padEnd(30)} ${u.id}`),
            page
        );

        return message.send(
            [
                message.translate('utility/discriminator:USERS', {
                    discriminator
                }),
                '',
                '```autohotkey',
                content,
                '```'
            ].join('\n')
        );
    }
}
