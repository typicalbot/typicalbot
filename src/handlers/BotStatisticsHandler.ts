import Handler from '../lib/handler/Handler';

const BotStatisticsHandler: Handler<'guildCreate'> = async (client, guild) => {
    if (!guild.available) return;
    if (client.dev) return;

    await client.sendStatistics(guild.shardID);
};

export default BotStatisticsHandler;
