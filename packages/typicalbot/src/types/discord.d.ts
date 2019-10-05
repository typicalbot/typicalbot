import * as i18next from 'i18next';
import Cluster from '..';
import { GuildSettings } from './typicalbot';

declare module 'discord.js' {
    interface Client {
        translate: Map<string, i18next.TFunction>;
    }

    interface Guild {
        client: Cluster;
        settings: GuildSettings;
    }

    interface GuildMember {
        client: Cluster;
    }
}
