import Event from '../structures/Event';
import { TypicalGuild } from '../types/typicalbot';

export default class GuildCreate extends Event {
    async execute(guild: TypicalGuild) {
        if (!guild.available) return;

        if (this.client.build === 'stable')
            await this.client.sendStatistics(guild.shardID);
    }
}
