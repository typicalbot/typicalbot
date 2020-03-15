export const Links = {
    BASE: 'https://www.typicalbot.com/',
    OAUTH: 'https://www.typicalbot.com/invite/',
    SERVER: 'https://www.typicalbot.com/join-us/',
    DONATE: 'https://www.typicalbot.com/donate/',
    DOCUMENTATION: 'https://www.typicalbot.com/documentation/',
    SETTINGS: 'https://www.typicalbot.com/documentation/#settings',
    ICON: 'https://www.typicalbot.com/x/images/icon.png'
};

export const Colors = {
    DEFAULT: 0x00adff,
    SUCCESS: 0x00ff00,
    ERROR: 0xff0000
};

export const Access = {};

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

export const Permissions = {};

export enum PermissionsLevels {
    SERVER_BLACKLISTED = -1,
    SERVER_MEMBER = 0,
    SERVER_MODERATOR = 2,
    SERVER_ADMINISTRATOR = 3,
    SERVER_OWNER = 4,
    TYPICALBOT_MAINTAINER = 10
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

export const ModerationLog = {};

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
    Access,
    AccessLevels,
    AccessTitles,
    Permissions,
    PermissionsLevels,
    PermissionsRoleTitles,
    Modes,
    ModerationLog,
    ModerationLogTypes,
    ModerationLogRegex
};
