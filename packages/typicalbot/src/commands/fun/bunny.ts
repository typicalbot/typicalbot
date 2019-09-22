import { Message, TextChannel, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../../../../src/structures/Command';

export default class extends Command {
    aliases = ['rabbit'];

    async execute(message: Message) {
        const type = Math.random() <= 0.25 ? 'gif' : 'poster';

        const data = await fetch(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .then((res) => res.json())
            .catch(() => message.error(this.client.translate('common:REQUEST_ERROR')));

        const canSendEmbed = message.guild
            && message.guild.me
            && message.guild.settings.embed
            && (message.channel as TextChannel).permissionsFor(message.guild.me);
        if (!canSendEmbed) return message.send(data.media[type]);

        return message.send(new MessageEmbed().setColor(0x00adff).setImage(data.media[type]));
    }
}
