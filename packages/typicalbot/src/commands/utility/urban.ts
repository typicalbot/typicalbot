import fetch from 'node-fetch';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

const regex = /(.*)/gi;

export default class extends Command {
    async execute(message: TypicalGuildMessage, parameters: string) {
        if (!message.channel.nsfw)
            return message.error(message.translate('common:NSFW'));

        const args = regex.exec(parameters);
        if (!args)
            return message.error(
                message.translate('misc:USAGE_ERROR', {
                    name: this.name,
                    prefix: this.client.config.prefix
                })
            );
        args.shift();
        const [query] = args;

        const data = await fetch(
            `http://api.urbandictionary.com/v0/define?term=${query}`
        )
            .then(res => res.json())
            .catch(() => null);
        if (!data)
            return message.error(message.translate('common:REQUEST_ERROR'));

        const [resp] = data.list;
        if (!resp)
            return message.error(message.translate('urban:NONE', { query }));

        if (!message.embedable)
            return message.reply(
                message.translate('urban:TEXT', {
                    query,
                    definition: resp.definition
                })
            );

        const rating = Math.round(
            (resp.thumbs_up / (resp.thumbs_up + resp.thumbs_down)) * 100
        );

        return message.send(
            new MessageEmbed()
                .setColor(0x00adff)
                .setTitle(query)
                .setURL(resp.permalink)
                .addField(
                    message.translate('urban:AMOUNT', { amount: data.length }),
                    `\n\u200B    ${resp.definition}`
                )
                .addField(
                    message.translate('urban:RATING'),
                    message.translate('urban:RATING_VALUE', {
                        up: resp.thumbs_up,
                        down: resp.thumbs_down,
                        rating: !isNaN(rating)
                            ? message.translate('urban:RATING_PERCENT', {
                                  amount: rating,
                                  total: resp.thumbs_up + resp.thumbs_down
                              })
                            : ''
                    })
                )
                .setThumbnail('http://i.imgur.com/CcIZZsa.png')
                .setFooter(message.translate('urban:DICTIONARY'))
        );
    }
}
