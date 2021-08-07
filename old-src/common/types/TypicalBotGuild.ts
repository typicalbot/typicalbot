interface GuildCustomCommand {
    guildId: string;
    command: string;
    content: string;
}

interface GuildStarboard {
    guildId: string;
    channelId: string;
    count: number;
}

export type {
    GuildCustomCommand,
    GuildStarboard
};
