import {
    Guild,
    GuildMember,
    GuildChannel,
    Message,
    MessageEmbed,
    MessageOptions,
    TextChannel,
    User
} from 'discord.js';
import Cluster from '../TypicalClient';
import Command from '../structures/Command';
import ModerationLog from '../structures/ModerationLog';
import PermLevel from '../structures/PermissionLevel';

export interface CommandOptions {
    description?: string;
    usage?: string;
    aliases?: string[];
    dm?: boolean;
    permission?: -1 | 0 | 2 | 3 | 4 | 10;
    mode?: 0 | 1 | 2;
    access?: 0 | 1 | 3;
    ptb?: boolean;
}

export interface GuildSettings {
    apikey?: string | null;
    id: string;
    language: string;
    dm: {
        commands: boolean;
    };
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
            delay: number | null;
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
    level: -1 | 0 | 2 | 3 | 4 | 10;
    staff?: boolean;
    staffOverride?: boolean;
}

export interface PermissionLevel {
    title: string;
    level: -1 | 0 | 2 | 3 | 4 | 10;
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

export interface HelperFunctions {
    convertTime: {
        execute(guild: TypicalGuild | TypicalMessage, time: number, short?: boolean): string;
    };
    fetchAccess: {
        execute(guild: Guild): Promise<AccessLevel>;
    };
    formatMessage: {
        execute(
            type: string,
            guild: TypicalGuild,
            user: User,
            content: string,
            options?: FormatMessageOptions
        ): Promise<string>;
    };
    lengthen: {
        execute(text: string, length: number): string;
    };
    pagify: {
        execute(
            message: TypicalGuildMessage,
            list: string[],
            page?: number
        ): string;
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
    menuResponse?: Message;
    embeddable: boolean;
    ask(question: string): Promise<Message | undefined>;
    chooseOption(options: string[]): Promise<string | undefined>;

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
    buildModerationLog(): Promise<ModerationLog>;
    translate(key: string, args?: object): string;
    fetchPermissions(userID: string, ignoreStaff?: boolean): Promise<PermLevel>;
    fetchSettings(): Promise<GuildSettings>;
}

export interface SettingsData {
    description: string;
    value: unknown;
    type: 'boolean' | 'roles' | 'role' | 'channel' | 'log' | 'ms' | 'default';
    path: string;
}

export interface BanLog {
    expiration: number;
    moderator: User;
    reason: string;
}

export interface UnbanLog {
    moderator: User;
    reason?: string;
}
export interface FormatMessageOptions {
    oldMember?: TypicalGuildMember;
    channel?: GuildChannel;
    message?: TypicalGuildMessage;
}
