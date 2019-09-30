import { MessageEmbed } from 'discord.js';
import { GuildSettings } from './typicalbot';
import * as i18next from 'i18next';

declare module 'discord.js' {
    interface Message {
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
        translate(key: string, args?: object): string;
    }

    interface Client {
        translate: Map<string, i18next.TFunction>;
    }

    interface Guild {
        settings: GuildSettings;
        translate(key: string, args?: object): string;
    }
}
