exports.Links = {
    BASE: "https://www.typicalbot.com/",
    OAUTH: "https://www.typicalbot.com/invite/",
    SERVER: "https://www.typicalbot.com/join-us/",
    DONATE: "https://www.typicalbot.com/donate/",
    DOCUMENTATION: "https://www.typicalbot.com/documentation/",
    SETTINGS: "https://www.typicalbot.com/documentation/#!settings",
    ICON: "https://www.typicalbot.com/x/images/icon.png"
};

exports.Colors = {
    DEFAULT: 0x00ADFF,
    SUCCESS: 0x00FF00,
    ERROR: 0xFF0000
};

exports.Access = {

};

exports.Access.Levels = {
    DEFAULT: 0,
    DONOR: 1,
    STAFF: 3
};

exports.Access.Titles = {
    DEFAULT: { "level": 0, "title": "Default" },
    DONOR: { "level": 1, "title": "TypicalBot Donor" },
    STAFF: { "level": 3, "title": "TypicalBot Staff" },
};

exports.Permissions = {

};

exports.Permissions.Levels = {
    SERVER_BLACKLISTED: -1,
    SERVER_MEMBER: 0,
    SERVER_DJ: 1,
    SERVER_MODERATOR: 2,
    SERVER_ADMINISTRATOR: 3,
    SERVER_OWNER: 4,
    TYPICALBOT_MAINTAINER: 10
};

exports.Permissions.RoleTitles = {
    ADMINISTRATOR: "TypicalBot Administrator",
    MODERATOR: "TypicalBot Moderator",
    DJ: "TypicalBot DJ",
    BLACKLIST: "TypicalBot Blacklist"
};

exports.Modes = {
    FREE: 0,
    LITE: 1,
    STRICT: 2
};

exports.ModerationLog = {

};

exports.ModerationLog.Types = {
    WARN: { hex: 0xFFFF00, display: "Warn" },
    PURGE: { hex: 0xFFFF00, display: "Message Purge" },
    TEMP_MUTE: { hex: 0xFF9900, display: "Temporary Mute" },
    MUTE: { hex: 0xFF9900, display: "Mute" },
    TEMP_VOICE_MUTE: { hex: 0xFF9900, display: "Temporary Voice Mute" },
    VOICE_MUTE: { hex: 0xFF9900, display: "Voice Mute" },
    KICK: { hex: 0xFF3300, display: "Kick" },
    VOICE_KICK: { hex: 0xFF3300, display: "Voice Kick" },
    SOFTBAN: { hex: 0xFF2F00, display: "Softban" },
    TEMP_BAN: { hex: 0xFF0000, display: "Temporary Ban" },
    BAN: { hex: 0xFF0000, display: "Ban" },
    UNMUTE: { hex: 0x006699, display: "Unmute" },
    UNBAN: { hex: 0x006699, display: "Unban" }
};

exports.ModerationLog.Regex = {
    CASE: /Case\s(\d+)/i,
    ACTION: /\*\*Action:\*\*\s.+/i,
    USER: /\*\*(?:User|Channel):\*\*\s.+/i,
    REASON: /\*\*Reason:\*\*\s.+/i
};