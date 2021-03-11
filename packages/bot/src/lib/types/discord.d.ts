import { Message } from 'packages/bot/src/lib/types/discord.js';
import { TFunction } from 'i18next';
import { GuildSettings } from './typicalbot';
import Cluster from '../TypicalClient';

declare module 'packages/bot/src/lib/types/discord.js' {
    interface Client {
        translate: Map<string, TFunction>;
    }

    interface Guild {
        client: Cluster;
        settings: GuildSettings;
    }

    interface GuildMember {
        client: Cluster;
    }

    interface ClientEvents {
        guildInvitePosted: [Message];
    }
}
