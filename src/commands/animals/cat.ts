import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['kitty', 'kitten'];

    async execute(message: TypicalGuildMessage) {
        const data = await fetch('https://aws.random.cat/meow')
            .then((res) => res.json())
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR')));
        if (!message.embeddable) return message.send(data.file);

        return message.send(new MessageEmbed().setColor(0x00adff).setImage(data.file));
    }
}
