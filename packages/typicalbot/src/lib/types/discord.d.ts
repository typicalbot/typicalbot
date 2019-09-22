import { MessageEmbed } from 'discord.js';
import { GuildSettings } from './typicalbot';

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
  }

  interface Client {
    translate(key: string, options?: Object): string;
  }

  interface Guild {
    settings: GuildSettings;
  }
}
