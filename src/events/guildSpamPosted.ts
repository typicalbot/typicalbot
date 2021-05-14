import Event from '../lib/structures/Event';
import { TypicalGuildMessage } from '../lib/types/typicalbot';
import { MODERATION_LOG_TYPE } from '../lib/utils/constants';
import { User } from 'discord.js';

export default class GuildSpamPosted extends Event {
    async execute(message: TypicalGuildMessage) {
        if (message.deletable) message.delete().catch(() => undefined);
        message.error(message.translate('general/spam:PROHIBITED')).then((msg) => msg.delete());

        const { settings } = message.guild;

        if (settings.logs.moderation) {
            await this.client.handlers.moderationLog
                .buildCase(message.guild)
                .setAction(MODERATION_LOG_TYPE.WARN)
                .setModerator(this.client.user as User)
                .setUser(message.author)
                .setReason(message.translate('general/spam:REASON', {
                    action: message.translate('common:WARN'),
                    type: message.translate('general/spam:SPAM'),
                    channel: `<#${message.channel.id}>`
                }))
                .send();
        }
    }
}
