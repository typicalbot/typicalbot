import Command from '../../structures/Command';
import { GuildMessage } from '../../types/typicalbot';

export default class extends Command {
    execute(message: GuildMessage) {
        const mention = message.mentions.users.first();
        const randomAddon = Math.random() <= 0.25;

        if (!mention || mention.id === message.author.id)
            return message.reply(
                message.translate(
                    randomAddon ? 'stab:SELF_POLICE' : 'stab:SELF'
                )
            );
        return message.reply(
            message.translate(
                randomAddon ? 'stab:RESPONSE_POLICE' : 'stab:RESPONSE',
                { user: mention }
            )
        );
    }
}
