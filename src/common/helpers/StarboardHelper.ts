import Database from '../database';
import type { GuildStarboard } from '../types/TypicalBotGuild';

const createStarboard = async (database: Database, starboard: GuildStarboard): Promise<void> => {
    await database.insert('typicalbot_starboard', starboard);
};

const getStarboard = async (database: Database, guildId: string): Promise<GuildStarboard | null> => {
    const starboard = await database.get('typicalbot_starboard', {
        guildId: guildId,
    }) as GuildStarboard;

    if (!starboard) {
        return null;
    }

    return starboard;
};

const updateStarboard = async (database: Database, guildId: string, starboard: GuildStarboard): Promise<void> => {
    await database.update('typicalbot_starboard', {
        guildId: guildId,
    }, starboard);
};

const deleteStarboard = async (database: Database, guildId: string): Promise<void> => {
    await database.delete('typicalbot_starboard', { guildId: guildId });
};

export {
    createStarboard,
    getStarboard,
    updateStarboard,
    deleteStarboard,
};
