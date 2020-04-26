export const Links = {
    BASE: 'https://typicalbot.com',
    OAUTH: 'https://typicalbot.com/invite',
    SERVER: 'https://typicalbot.com/join-us',
    DONATE: 'https://typicalbot.com/donate',
    DOCUMENTATION: 'https://typicalbot.com/documentation',
    SETTINGS: 'https://typicalbot.com/documentation#settings',
    ICON: 'https://typicalbot.com/img/icon.png',
    TRANSLATE: 'https://translate.typicalbot.com',
    VOTE: 'https://top.gg/bot/153613756348366849/vote'
};

export const Colors = {
    DEFAULT: 0x00adff,
    SUCCESS: 0x00ff00,
    ERROR: 0xff0000
};

export enum AccessLevels {
    DEFAULT = 0,
    DONOR = 1,
    STAFF = 3
}

export const AccessTitles = {
    DEFAULT: { level: 0, title: 'Default' },
    DONOR: { level: 1, title: 'TypicalBot Donor' },
    STAFF: { level: 3, title: 'TypicalBot Staff' }
};

export enum PermissionsLevels {
    SERVER_BLACKLISTED = -1,
    SERVER_MEMBER = 0,
    SERVER_MODERATOR = 2,
    SERVER_ADMINISTRATOR = 3,
    SERVER_OWNER = 4,
    BOT_OWNER = 10
}

export const PermissionsRoleTitles = {
    ADMINISTRATOR: 'TypicalBot Administrator',
    MODERATOR: 'TypicalBot Moderator',
    BLACKLIST: 'TypicalBot Blacklist'
};

export enum Modes {
    FREE = 0,
    LITE = 1,
    STRICT = 2
}

export const ModerationLogTypes = {
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

export const ModerationLogRegex = {
    CASE: /Case\s(\d+)/i,
    ACTION: /\*\*Action:\*\*\s.+/i,
    USER: /\*\*(?:User|Channel):\*\*\s.+/i,
    REASON: /\*\*Reason:\*\*\s.+/i
};

export default {
    Links,
    Colors,
    AccessLevels,
    AccessTitles,
    PermissionsLevels,
    PermissionsRoleTitles,
    Modes,
    ModerationLogTypes,
    ModerationLogRegex
};
