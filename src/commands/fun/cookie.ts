import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    execute(message: TypicalGuildMessage) {
        const mention = message.mentions.users.first();
        const randomAddon = Math.random() <= 0.25;

        if (!mention || mention.id === message.author.id)
            return message.reply(message.translate(randomAddon
                ? 'fun/cookie:SELF_LAUGH'
                : 'fun/cookie:SELF_KEPT'));
        return message.reply(message.translate('fun/cookie:GIVEN', { user: mention.toString() }));
    }
}
