export interface AmplitudeEvent {
    userId: string;
    eventType: 'MESSAGE_CREATE' | 'COMMAND_CREATE';
    eventProperties: {
        messageId?: string;
        channelId?: string;
        guildId?: string;
        timestamp: number;
        command?: string;
        commandArgs?: string[];
    };
}
