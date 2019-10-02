import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../structures/Command';
import { GuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['puppy', 'doggy'];

    async execute(message: GuildMessage) {
        const data = await fetch('https://dog.ceo/api/breeds/image/random')
            .then(res => res.json())
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR'))
            );

        if (!message.embedable) return message.send(data.message);

        return message.send(
            new MessageEmbed().setColor(0x00adff).setImage(data.message)
        );
    }
}
