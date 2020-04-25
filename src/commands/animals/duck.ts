import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    async execute(message: TypicalGuildMessage) {
        const data = await fetch('https://random-d.uk/api/v2/quack')
            .then((res) => res.json())
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR')));

        if (!message.embeddable) return message.send(data.url);

        return message.send(new MessageEmbed().setColor(0x00adff).setImage(data.url).setFooter(data.message));
    }
}
