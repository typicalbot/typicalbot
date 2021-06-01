/**
 * The available languages that TypicalBot can be used in.
 */
type GuildLanguage = 'bg-BG' | 'de-DE' | 'en-US' | 'es-ES' | 'fr-FR' | 'pl-PL' | 'ru-RU' | 'sl-SL' | 'sv-SE' | 'tr-TR';

/**
 * The reaction role mode that will either keep reactions or delete them upon reacting.
 *
 * default: give role when adding reaction, take role when removing reaction.
 * reverse: delete reaction after user has been given (or taken) role.
 */
type GuildReactionRoleMode = 'default' | 'reverse';

/**
 * The different actions taken against users.
 */
type GuildModerationCaseType = 'ban' | 'unban' | 'kick';

/**
 * Basic settings changeable within TypicalBot.
 */
interface GuildSettings {
    guildId: string;
    prefix: string;
    language: GuildLanguage;
    timezone: string;
}

/**
 * Create custom text-based (will be expanded in future) commands.
 */
interface GuildCustomCommand {
    guildId: string;
    command: string;
    content: string;
}

/**
 * Ability to react to a message to receive a role.
 */
interface GuildReactionRole {
    guildId: string;
    messageId: string;
    channelId: string;
    reactions: {
        roleId: string;
        emote: string;
    };
    type: GuildReactionRoleMode;
    limit: boolean;
}

/**
 * Create and view a moderation case
 */
interface GuildModerationCase {
    guildId: string;
    case: {
        id: string;
        type: GuildModerationCaseType;
        user: string;
        reason: string;
        moderator: string;
    };
}

export {
    GuildSettings,
    GuildCustomCommand,
    GuildReactionRole,
    GuildModerationCase
};

export type {
    GuildLanguage,
    GuildReactionRoleMode,
    GuildModerationCaseType
};
