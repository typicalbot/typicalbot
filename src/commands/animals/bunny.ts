import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

export default class extends Command {
    aliases = ['rabbit'];

    async execute(message: TypicalGuildMessage) {
        const type = Math.random() <= 0.25 ? 'gif' : 'poster';

        const data = await fetch(`https://api.bunnies.io/v2/loop/random/?media=${type}`)
            .then((res) => res.json())
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR')));

        if (!message.embeddable) return message.send(data.media[type]);

        return message.send(new MessageEmbed().setColor(0x00adff).setImage(data.media[type]).setFooter('Powered by bunnies.io'));
    }
}
