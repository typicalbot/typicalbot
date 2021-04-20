import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

export default class extends Command {
    async execute(message: TypicalGuildMessage) {
        const text = await fetch('http://numbersapi.com/random/year')
            .then((res) => res.text())
            .catch(() =>
                message.error(message.translate('common:REQUEST_ERROR')));
        if (!message.embeddable) return message.send(`${text}`);

        return message.send(new MessageEmbed().setColor(0x00adff).setTitle(message.translate('fun/yearfact:TITLE')).setDescription(`${text}`).setFooter(message.translate('common:POWERED_BY', { service: 'numbersapi.com' })));
    }
}
