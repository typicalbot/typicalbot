import {
    Guild,
    GuildMember,
    Message,
    MessageEmbed,
    MessageOptions,
    TextChannel,
    User
} from 'discord.js';
import Command from '../structures/Command';
import Cluster from '..';
import Stream from '../structures/Stream';

export interface CommandOptions {
    description?: string;
    usage?: string;
    aliases?: string[];
    dm?: boolean;
    permission?: -1 | 0 | 1 | 2 | 3 | 4 | 10;
    mode?: 0 | 1 | 2;
    access?: 0 | 1 | 3;
    ptb?: boolean;
}

export interface GuildSettings {
    apikey?: string | null;
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
    aliases: TypicalCommandAlias[];
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
            silent: boolean;
        };
        message: string | null;
        nickname: string | null;
    };
    mode: 'free' | 'lite' | 'strict';
    prefix: {
        custom: string | null;
        default: boolean;
    };
    automod: {
        invite: boolean;
        inviteaction: boolean;
        invitewarn: number;
        invitekick: number;
        link: boolean;
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
        timelimit: number | null;
        queuelimit: number | null;
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

export interface UnbanTaskData {
    guildID: string;
    userID: string;
}

export interface UnmuteTaskData {
    guildID: string;
    memberID: string;
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

export interface ModlogAction {
    hex: number;
    display: string;
}

export interface TypicalCommandAlias {
    alias: string;
    command: string;
}

export interface TypicalDonor {
    id: string;
    amount: number;
}

export interface HelperFunctions {
    convertTime: {
        execute(message: Message, time: number): string;
    };
    fetchAccess: {
        execute(guild: Guild): Promise<AccessLevel>;
    };
    permissionError: {
        execute(
            message: TypicalGuildMessage,
            command: Command,
            userLevel: PermissionLevel,
            permission?: 0 | 1 | -1 | 2 | 3 | 4 | 10
        ): string;
    };
    resolveMember: {
        execute(
            message: TypicalGuildMessage,
            id?: string,
            username?: string,
            discriminator?: string,
            returnSelf?: boolean
        ): Promise<GuildMember | null>;
    };
}

export interface AccessLevel {
    level: 0 | 1 | 3;
    title: 'Default' | 'TypicalBot Staff' | 'TypicalBot Donor';
}

export interface TypicalMessage extends Message {
    embedable: boolean;

    dm(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    error(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    send(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    success(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    respond(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    translate(key: string, args?: object): string;
}

export interface TypicalGuildMessage extends TypicalMessage {
    author: User;
    guild: TypicalGuild;
    member: TypicalGuildMember;
    channel: TextChannel;
}

export interface TypicalGuildMember extends GuildMember {
    fetchPermissions(ignoreStaff?: boolean): Promise<PermissionLevel>;
}

export interface TypicalGuild extends Guild {
    client: Cluster;
    settings: GuildSettings;
    buildModerationLog(message: TypicalGuildMessage): Promise<void>;
    translate(key: string, args?: object): string;
    fetchPermissions(
        userID: string,
        ignoreStaff?: boolean
    ): Promise<PermissionLevel>;
    fetchSettings(): Promise<GuildSettings>;
    guildStream: Stream;
    _guildStream: Stream;
}
