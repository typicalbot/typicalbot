import {
    Structures,
    MessageEmbed,
    MessageOptions,
    DMChannel
} from 'discord.js';

export class TypicalMessage extends Structures.get('Message') {
    get embeddable() {
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
        if (typeof content === 'string') {
            content = (content || '').replace(/@(everyone|here)/g, '@\u200b$1');
            const matches = content.match(/<@&(\d{17,19})>/g);
            if (matches != null) {
                matches.forEach(match => {
                    match = match.replace('<@&', '').replace('>', '');

                    if (this.guild && this.guild.roles.cache.has(match)) {
                        match =
                            '@\u200b' + this.guild.roles.cache.get(match)?.name;
                    } else {
                        match = '@\u200bdeleted-role';
                    }
                    content = (content as string).replace(
                        /<@&(\d{17,19})>/,
                        match
                    );
                });
            }
            return this.channel.send(content, { ...options, embed });
        }
        return this.channel.send(content);
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

    translate(key: string, args?: object) {
        const language = this.client.translate.get(
            this.guild ? this.guild.settings.language : 'en-US'
        );

        if (!language) throw 'Message: Invalid language set in settings.';

        return language(key, args);
    }
}

Structures.extend('Message', () => TypicalMessage);
