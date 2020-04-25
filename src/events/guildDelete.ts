import Event from '../lib/structures/Event';
import { TypicalGuild } from '../types/typicalbot';

export default class GuildDelete extends Event {
    execute(guild: TypicalGuild) {
        this.client.analytics.addEvent({
            userId: guild.ownerID,
            eventType: 'GUILD_DELETE',
            eventProperties: {
                guildId: guild.id,
                timestamp: Date.now(),
            }
        });
    }
}
