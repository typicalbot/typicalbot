import { GuildModerationCaseType } from './GuildStructure';

type UserModerationProfileAction = GuildModerationCaseType & 'edited';

interface UserModerationProfile {
    guildId: string;
    userId: string;
    actions: {
        [key: string]: number;
    };
}

export {
    UserModerationProfile
};

export type {
    UserModerationProfileAction
};
