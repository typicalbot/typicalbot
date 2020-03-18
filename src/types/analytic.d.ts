export interface AnalyticEvent {
    userId: string;
    eventType: 'COMMAND_CREATE' | 'GUILD_CREATE' | 'GUILD_DELETE';
    eventProperties: {
        messageId?: string;
        channelId?: string;
        guildId?: string;
        timestamp: number;
        command?: string;
        commandArgs?: string[];
    };
}
