import { TFunction } from 'i18next';
import { GuildSettings } from './typicalbot';
import Cluster from '../client';

declare module 'discord.js' {
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
}
