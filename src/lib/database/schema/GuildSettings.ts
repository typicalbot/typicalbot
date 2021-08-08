interface GuildSettings {
    id: string;
    language: string;
    // TODO: remove this variable
    dm: {
        commands: boolean;
    };
    // TODO: remove this variable
    embed: boolean;
    roles: {
        administrator: string[];
        moderator: string[];
        blacklist: string[];
        public: string[];
        mute: string | null;
    };
    ignored: {
        commands: string[];
        invites: string[];
        stars: string[];
    };
    announcements: {
        id: string | null;
        mention: string | null;
    };
    // TODO: remove this variable
    aliases: GuildCommandAliases[];
    logs: {
        id: string | null;
        join: string | null;
        leave: string | null;
        ban: string | null;
        unban: string | null;
        nickname: string | null;
        invite: string | null;
        moderation: string | null;
        purge: string | null;
        say: string | null;
        slowmode: string | null;
    };
    auto: {
        role: {
            bots: string | null;
            id: string | null;
            delay: number | null;
            silent: boolean;
        };
        message: string | null;
        nickname: string | null;
    };
    // TODO: remove this variable
    mode: 'free' | 'lite' | 'strict';
    // TODO: remove this variable
    prefix: {
        custom: string | null;
        default: boolean;
    };
    automod: {
        spam: {
            mentions: {
                enabled: boolean;
                severity: number;
            };
            caps: {
                enabled: boolean;
                severity: number;
            };
            zalgo: {
                enabled: boolean;
                severity: number;
            };
            scamlinks: {
                enabled: boolean;
            };
        };
        invite: boolean;
        inviteaction: boolean;
        invitewarn: number;
        invitekick: number;
    };
    nonickname: boolean;
    subscriber: string | null;
    starboard: {
        id: string | null;
        count: number;
    };
    // TODO: remove this variable
    pcs: string[];
    // TODO: remove this variable
    webhooks: {
        twitch: {
            id: string | null;
            message: string | null;
        };
    };
}

interface GuildCommandAliases {
    alias: string;
    command: string;
}

export default GuildSettings;
