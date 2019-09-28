import { MessageEmbed } from 'discord.js';
import { GuildSettings } from './typicalbot';
import * as i18next from 'i18next';

declare module 'discord.js' {
    interface Message {
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
        translate(key: string, args?: object): string;
        embedable: boolean;
    }

    interface Client {
        translate: Map<string, i18next.TFunction>;
    }

    interface Guild {
        settings: GuildSettings;
        translate(key: string, args?: object): string;
    }
}
