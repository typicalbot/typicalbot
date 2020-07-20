import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

export default class extends Command {
    async execute(message: TypicalGuildMessage) {
        const data = await fetch('https://some-random-api.ml/facts/cat')
            .then((res) => res.json())
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR')));
        if (!message.embeddable) return message.send(data.fact);

        return message.send(new MessageEmbed().setColor(0x00adff).setTitle('Cat Fact').setDescription(data.fact).setFooter('Powered by some-random-api.ml'));
    }
}
