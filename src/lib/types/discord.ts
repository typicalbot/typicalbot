import { Message } from 'discord.js';
import { TFunction } from 'i18next';
import { GuildSettings } from './typicalbot';
import TypicalClient from '../TypicalClient';

declare module 'discord.js' {
    interface Client {
        translate: Map<string, TFunction>;
    }

    interface Guild {
        client: TypicalClient;
        settings: GuildSettings;
    }

    interface GuildMember {
        client: TypicalClient;
    }

    interface ClientEvents {
        guildInvitePosted: [Message];
    }
}
