import Cluster from '..';
import { GuildSettings } from './typicalbot';
import { TFunction } from 'i18next';

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
