import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

export default class extends Command {
    execute(message: TypicalGuildMessage) {
        const mention = message.mentions.users.first();
        const randomAddon = Math.random() <= 0.25;

        if (!mention || mention.id === message.author.id)
            return message.reply(message.translate(randomAddon
                ? 'interaction/cookie:SELF_LAUGH'
                : 'interaction/cookie:SELF_KEPT'));
        return message.reply(message.translate('interaction/cookie:GIVEN', { user: mention.toString() }));
    }
}
