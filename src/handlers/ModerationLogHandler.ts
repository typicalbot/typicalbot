import { Guild, TextChannel, User } from 'discord.js';
import Cluster from '../lib/TypicalClient';
import ModerationLog from '../lib/structures/ModerationLog';
import { TypicalGuildMessage, TypicalGuild } from '../lib/types/typicalbot';

export default class ModerationLogHandler {
    client: Cluster;

    constructor(client: Cluster) {
        this.client = client;
    }

    async fetchChannel(guild: Guild): Promise<TextChannel | null> {
        const settings = await this.client.settings.fetch(guild.id);

        if (!settings.logs.moderation)
            return null;
        if (!guild.channels.cache.has(settings.logs.moderation))
            return null;

        return guild.channels.cache.get(settings.logs.moderation) as TextChannel;
    }

    async fetchCase(guild: Guild, id = 'latest') {
        const channel = await this.fetchChannel(guild);

        if (!channel) return;

        const messages = await channel.messages
            .fetch({ limit: 100 })
            .catch(() => {
                throw new Error("Couldn't fetch messages.");
            });

        for (const message of messages.values()) {
            if (
                message.author.id !==
                (this.client.user && this.client.user.id) ||
                !message.embeds.length
            )
                continue;

            const [embed] = message.embeds;

            if (embed.type !== 'rich' || !embed.footer || !embed.footer.text)
                continue;

            if (!embed.footer.text.startsWith('Case ')) continue;

            if (id === 'latest') return message;
            if (embed.footer.text === `Case ${id}`) return message;
        }

        return null;
    }

    buildCase(guild: TypicalGuild): ModerationLog {
        return new ModerationLog(this.client, guild);
    }

    edit(message: TypicalGuildMessage, moderator: User, reason: string) {
        const [embed] = message.embeds;

        const start = embed.description
            ? embed.description.substring(0, embed.description.lastIndexOf('\n'))
            : '';

        return message.edit(embed
            .setAuthor(`${moderator.tag} (${moderator.id})`, moderator.displayAvatarURL())
            .setDescription([
                start,
                message.translate('moderation/modlog:REASON', {
                    reason
                })
            ]));
    }
}
