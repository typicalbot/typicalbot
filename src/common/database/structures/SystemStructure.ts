/**
 * TypicalBot will automatically leave guilds that are blacklisted.
 */
interface SystemGuildBlacklist {
    guildId: string;
    reason: string;
}

/**
 * TypicalBot will not respond to commands executed by users who have been blacklisted.
 */
interface SystemUserBlacklist {
    userId: string;
    reason: string;
}

export {
    SystemGuildBlacklist,
    SystemUserBlacklist
};
