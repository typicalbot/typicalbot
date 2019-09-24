import fetch from 'node-fetch'
import Command from '../../structures/Command'
import { Message, MessageEmbed } from 'discord.js';

export default class extends Command {
    aliases = ['kitty', 'kitten'];

    async execute(message: Message) {
        const data = await fetch('https://aws.random.cat/meow')
            .then((res) => res.json())
            .catch(() => message.error(message.translate('common:REQUEST_ERROR')));
        if (!message.embedable) return message.send(data.file);

        return message.send(new MessageEmbed().setColor(0x00adff).setImage(data.file));
    }

};
