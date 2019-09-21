exports.Colors = {
    DEFAULT: 0x00ADFF,
    SUCCESS: 0x00FF00,
    ERROR: 0xFF0000,
};

/**
 * URLs.
 * @property {string} base The base URL for other links
 * @property {string} docs The URL to the documentation
 * @property {string} oauth The invite URL for the bot
 * @property {string} server The invite URL for the server
 * @property {string} donate The URL to the donate page on the website
 * @property {string} settings The URL to the settings section of the documentation
 * @property {string} icon The URL to the image of the bot's icon
 */
exports.URL = {
    base: 'https://typicalbot.com/',
    docs: `${this.base}/documentation/`,
    oauth: `${this.base}/invite/`,
    server: `${this.base}/join-us/`,
    donate: `${this.base}/donate/`,
    settings: `${this.base}/documentation/#!settings`,
    icon: `${this.base}/x/images/icon.png`,
};

/**
 * The mode of the bot. Here are the available modes:
 * * FREE: 0
 * * LITE: 1
 * * STRICT: 2
 * @typedef {number} Mode
 */
exports.Mode = {
    FREE: 0,
    LITE: 1,
    STRICT: 2,
};

exports.ModLogRegex = {
    CASE: /Case\s(\d+)/i,
    ACTION: /\*\*Action:\*\*\s.+/i,
    USER: /\*\*(?:User|Channel):\*\*\s.+/i,
    REASON: /\*\*Reason:\*\*\s.+/i,
};

exports.ModLogTypes = {
    WARN: { hex: 0xFFFF00, display: 'Warn' },
    MUTE: { hex: 0xFF9900, display: 'Mute' },
    KICK: { hex: 0xFF3300, display: 'Kick' },
    BAN: { hex: 0xFF0000, display: 'Ban' },
    UNBAN: { hex: 0x006699, display: 'Unban' },
    UNMUTE: { hex: 0x006699, display: 'Unmute' },
    PURGE: { hex: 0xFFFF00, display: 'Message Purge' },
    SOFTBAN: { hex: 0xFF2F00, display: 'Softban' },
    TEMP_BAN: { hex: 0xFF0000, display: 'Temporary Ban' },
    TEMP_MUTE: { hex: 0xFF9900, display: 'Temporary Mute' },
    TEMP_VOICE_MUTE: { hex: 0xFF9900, display: 'Temporary Voice Mute' },
    VOICE_KICK: { hex: 0xFF3300, display: 'Voice Kick' },
    VOICE_MUTE: { hex: 0xFF9900, display: 'Voice Mute' },
};

/**
 * The permission levels of the bot. Here are the available levels:
 * * BLACKLISTED: -1
 * * MEMBER: 0
 * * DJ: 1
 * * MODERATOR: 2
 * * ADMINISTRATOR: 3
 * * OWNER: 4
 * @typedef {number} PermissionLevel
 */
exports.PermissionLevels = {
    BLACKLISTED: 0,
    MEMBER: 1,
    DJ: 2,
    MODERATOR: 3,
    ADMINISTRATOR: 4,
    OWNER: 5,
};

/**
 * The titles of the permission levels:
 * * BLACKLISTED
 * * MEMBER
 * * DJ
 * * MODERATOR
 * * ADMINISTRATOR
 * * OWNER
 * @typedef {string} PermissionTitle
 */
exports.PermissionTitles = [
    'Blacklisted',
    'Member',
    'DJ',
    'Moderator',
    'Administrator',
    'OWNER',
];
