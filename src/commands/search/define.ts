import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

const regex = /(.*)/gi;

export default class extends Command {
    async execute(message: TypicalGuildMessage, parameters: string) {
        if (!message.channel.nsfw)
            return message.error(message.translate('common:NSFW'));

        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: process.env.PREFIX
            }));
        args.shift();
        const [query] = args;

        const data = await fetch(`https://api.urbandictionary.com/v0/define?term=${query}`)
            .then((res) => res.json())
            .catch(() => null);
        if (!data)
            return message.error(message.translate('common:REQUEST_ERROR'));

        const [resp] = data.list;
        if (!resp)
            return message.error(message.translate('search/define:NONE', { query }));

        if (!message.embeddable)
            return message.reply(message.translate('search/define:TEXT', {
                query,
                definition: resp.definition
            }));

        const rating = Math.round((resp.thumbs_up / (resp.thumbs_up + resp.thumbs_down)) * 100);

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle(query)
            .setURL(resp.permalink)
            .addFields([
                {
                    name: message.translate('search/define:AMOUNT', {
                        amount: data.length
                    }),
                    value: `\n\u200B    ${resp.definition}`
                },
                {
                    name: message.translate('search/define:RATING'),
                    value: message.translate('search/define:RATING_VALUE', {
                        up: resp.thumbs_up,
                        down: resp.thumbs_down,
                        rating: !isNaN(rating)
                            ? message.translate('search/define:RATING_PERCENT', {
                                amount: rating,
                                total:
                                    resp.thumbs_up + resp.thumbs_down
                            })
                            : ''
                    })
                }
            ])
            .setThumbnail('https://i.imgur.com/CcIZZsa.png')
            .setFooter(message.translate('search/define:DICTIONARY')));
    }
}
