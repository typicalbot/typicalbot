import { MessageEmbed } from 'discord.js';

declare module 'discord.js' {
  interface Message {
    error(content: string, embed?: MessageEmbed, options?: MessageOptions): Promise<Message>;
  }
}
