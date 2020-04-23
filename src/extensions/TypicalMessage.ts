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

    async ask(question: string) {
        await this.respond(question);
        const responses = await this.channel.awaitMessages((msg) => msg.author.id === this.author.id, { time: 15000, max: 1 });
        const response = responses.first();
        return response
    }

    async chooseOption(options: string[]) {
        const response = await this.ask(this.translate('misc:CHOOSE_OPTION', { options: options.map((opt, index) => `**${index}** - ${opt}`) }));
        if (!response) return;

        const number = Number(response.content);
        if (number > options.length) return;

        return options[Math.floor(number)];
    }

    respond(content: string, embed?: MessageEmbed) {
        return this.send(`${this.author} | ${content}`, embed);
    }

    send(content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions) {
        if (typeof content === 'string') {
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

    dm(content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions) {
        return this.author && this.author.send(content, { ...options, embed });
    }

    translate(key: string, args?: object) {
        const language = this.client.translate.get(this.guild ? this.guild.settings.language : 'en-US');

        if (!language) throw 'Message: Invalid language set in settings.';

        return language(key, args);
    }
}

Structures.extend('Message', () => TypicalMessage);
