/* eslint-disable @typescript-eslint/naming-convention */
export const WEBSITE = 'https://typicalbot.com';

export const LINK = {
    OAUTH: `${WEBSITE}/invite`,
    SERVER: `${WEBSITE}/support`,
    DONATE: `${WEBSITE}/donate`,
    DOCUMENTATION: `${WEBSITE}/docs`,
    SETTINGS: `${WEBSITE}/docs`,
    ICON: `${WEBSITE}/img/icon-transparent-blue.png`,
    TRANSLATE: 'https://translate.typicalbot.com',
    VOTE: 'https://top.gg/bot/153613756348366849/vote',
    TERMS_OF_SERVICE: `${WEBSITE}/legal/terms`,
    PRIVACY_POLICY: `${WEBSITE}/legal/privacy`
};

export enum ACCESS_LEVEL {
    DEFAULT = 0,
    STAFF = 3
}

export const ACCESS_TITLE = {
    DEFAULT: { level: 0, title: 'Default' },
    STAFF: { level: 3, title: 'TypicalBot Staff' }
};

export enum PERMISSION_LEVEL {
    SERVER_BLACKLISTED = -1,
    SERVER_MEMBER = 0,
    SERVER_MODERATOR = 2,
    SERVER_ADMINISTRATOR = 3,
    SERVER_OWNER = 4,
    BOT_OWNER = 10
}

export const PERMISSION_ROLE_TITLE = {
    ADMINISTRATOR: 'TypicalBot Administrator',
    MODERATOR: 'TypicalBot Moderator',
    BLACKLIST: 'TypicalBot Blacklist'
};

export enum MODE {
    FREE = 0,
    LITE = 1,
    STRICT = 2
}

export const MODERATION_LOG_TYPE = {
    WARN: { hex: 0xffff00, display: 'Warn' },
    PURGE: { hex: 0xffff00, display: 'Message Purge' },
    TEMP_MUTE: { hex: 0xff9900, display: 'Temporary Mute' },
    MUTE: { hex: 0xff9900, display: 'Mute' },
    TEMP_VOICE_MUTE: { hex: 0xff9900, display: 'Temporary Voice Mute' },
    VOICE_MUTE: { hex: 0xff9900, display: 'Voice Mute' },
    KICK: { hex: 0xff3300, display: 'Kick' },
    VOICE_KICK: { hex: 0xff3300, display: 'Voice Kick' },
    SOFTBAN: { hex: 0xff2f00, display: 'Softban' },
    TEMP_BAN: { hex: 0xff0000, display: 'Temporary Ban' },
    BAN: { hex: 0xff0000, display: 'Ban' },
    UNMUTE: { hex: 0x006699, display: 'Unmute' },
    UNBAN: { hex: 0x006699, display: 'Unban' }
};

export const MODERATION_LOG_REGEX = {
    CASE: /Case\s(\d+)/i,
    ACTION: /\*\*Action:\*\*\s.+/i,
    USER: /\*\*(?:User|Channel):\*\*\s.+/i,
    REASON: /\*\*Reason:\*\*\s.+/i
};
