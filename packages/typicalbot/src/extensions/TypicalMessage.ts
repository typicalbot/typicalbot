import {
    Message,
    Structures,
    MessageEmbed,
    MessageOptions,
    DMChannel
} from 'discord.js';

export class TypicalMessage extends Message {
    get embedable() {
        if (
            !this.guild ||
            !this.guild.me ||
            !this.guild.settings ||
            !this.guild.settings.embed ||
            this.channel instanceof DMChannel
        )
            return false;

        const perms = this.channel.permissionsFor(this.guild.me);
        if (!perms) return false;

        return perms.has('EMBED_LINKS');
    }

    respond(content: string, embed?: MessageEmbed) {
        return this.send(`${this.author} | ${content}`, embed);
    }

    send(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ) {
        return this.channel.send(content, { ...options, embed });
    }

    embed(embed: MessageEmbed) {
        return this.channel.send('', embed);
    }

    success(content: string, embed?: MessageEmbed) {
        return this.channel.send(`${this.author} | ✔️ | ${content}`, embed);
    }

    error(content: string, embed?: MessageEmbed) {
        return this.channel.send(`${this.author} | ❌ | ${content}`, embed);
    }

    dm(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ) {
        return this.author && this.author.send(content, { ...options, embed });
    }

    translate(key: string, args: object) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const language = this.client.translate.get(
            this.guild ? this.guild.settings.language : 'en-US'
        );

        if (!language) throw 'Message: Invalid language set in settings.';

        return language(key, args);
    }
}

Structures.extend('Message', () => TypicalMessage);
