import Event from '../lib/structures/Event';
import { TypicalGuild } from '../lib/types/typicalbot';

export default class GuildCreate extends Event {
    async execute(guild: TypicalGuild) {
        if (!guild.available) return;

        if (process.env.NODE_ENV === 'production')
            await this.client.sendStatistics(guild.shardID);

        this.client.analytics.addEvent({
            userId: guild.ownerID,
            eventType: 'GUILD_CREATE',
            eventProperties: {
                guildId: guild.id,
                timestamp: Date.now(),
            }
        });
    }
}
