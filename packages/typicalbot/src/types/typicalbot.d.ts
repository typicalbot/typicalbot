import { Guild, GuildMember } from 'discord.js';

export interface CommandOptions {
    description?: string;
    usage?: string;
    aliases?: string[];
    dm?: boolean;
    permission?: -1 | 0 | 1 | 2 | 3 | 4 | 10;
    mode?: 0 | 1 | 2;
    access?: 0 | 1 | 3;
}

export interface GuildSettings {
    id: string;
    language: string;
    embed: boolean;
    roles: {
        administrator: string[];
        moderator: string[];
        dj: string[];
        blacklist: string[];
        public: string[];
        mute: string | string | null;
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
    aliases: string[];
    logs: {
        id: string | null;
        join: string | null;
        leave: string | null;
        ban: string | null;
        unban: string | null;
        delete: string | null;
        nickname: string | null;
        invite: string | null;
        moderation: string | null;
        purge: string | null;
        say: string | null;
    };
    auto: {
        role: {
            bots: string | null;
            id: string | null;
            delay: string | null;
            silent: true;
        };
        message: string | null;
        nickname: string | null;
    };
    mode: string;
    prefix: {
        custom: string | null;
        default: true;
    };
    automod: {
        invite: false;
        inviteaction: false;
        invitewarn: 1;
        invitekick: 3;
        link: false;
    };
    nonickname: boolean;
    music: {
        default: string;
        play: string;
        skip: string;
        stop: string;
        pause: string;
        resume: string;
        unqueue: string;
        volume: string;
        timelimit: string | null;
        queuelimit: string | null;
        apikey: string | null;
    };
    subscriber: string | null;
    starboard: {
        id: string | null;
        count: number;
    };
    pcs: string[];
    webhooks: {
        twitch: {
            id: string | null;
            message: string | null;
        };
    };
}

export interface TaskOptions {
    data: unknown;
    id: number;
    end: number;
    type: string;
}

export interface PermissionLevelOptions {
    title: string;
    level: -1 | 0 | 1 | 2 | 3 | 4 | 10;
    staff?: boolean;
    staffOverride?: boolean;
}

export interface PermissionLevel {
    title: string;
    level: -1 | 0 | 1 | 2 | 3 | 4 | 10;
    staff?: boolean;
    staffOverride?: boolean;
    check(guild: Guild, member: GuildMember): boolean;
}
