export interface AnalyticEvent {
    userId: string;
    eventType: 'COMMAND_CREATE';
    eventProperties: {
        messageId?: string;
        channelId?: string;
        guildId?: string;
        timestamp: number;
        command?: string;
        commandArgs?: string[];
    };
}
