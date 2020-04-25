import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

export default class extends Command {
    aliases = ['birb']

    async execute(message: TypicalGuildMessage) {
        const data = await fetch('https://some-random-api.ml/img/birb')
            .then((res) => res.json())
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR')));

        if (!message.embeddable) return message.send(data.link);

        return message.send(new MessageEmbed().setColor(0x00adff).setImage(data.link));
    }
}
