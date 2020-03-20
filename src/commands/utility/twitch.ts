import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';

const regex = /(.*)/gi;

export default class extends Command {
    async execute(message: TypicalGuildMessage, parameters: string) {
        const args = regex.exec(parameters);
        if (!args)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: this.client.config.prefix
            }));
        args.shift();
        const [name] = args;

        const json = await fetch(`https://api.twitch.tv/helix/users?login=${name}`, {
            method: 'get',
            headers: { 'Client-ID': this.client.config.apis.twitch }
        })
            .then((res) => res.json())
            .catch(() => null);

        if (!json)
            return message.error(message.translate('common:REQUEST_ERROR'));

        const data = json.data[0];
        if (!message.embeddable)
            return message.reply([
                message.translate('utility/twitch:STATS', {
                    name: data.display_name
                }),
                '```',
                message.translate('utility/twitch:ID', { id: data.id }),
                message.translate('utility/twitch:DISPLAY', {
                    name: data.display_name
                }),
                message.translate('utility/twitch: DESC', {
                    description: data.description
                }),
                message.translate('utility/twitch:STATUS', {
                    type: data.broadcaster_type
                }),
                message.translate('utility/twitch:PROFILE', {
                    url: data.profile_image_url
                }),
                message.translate('utility/twitch:VIEWS', {
                    amount: data.view_count
                }),
                '```'
            ].join('\n'));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle('Twitch Statistics')
            .setDescription(data.description)
            .addFields([
                {
                    name: message.translate('common:ID_FIELD'),
                    value: data.id,
                    inline: true
                },
                {
                    name: message.translate('common:DISPLAYNAME_FIELD'),
                    value: data.display_name,
                    inline: true
                },
                {
                    name: message.translate('common:STATUS_FIELD'),
                    value: data.broadcaster_type,
                    inline: true
                },
                {
                    name: message.translate('common:TOTALVIEWS_FIELD'),
                    value: data.view_count,
                    inline: true
                }
            ])
            .setThumbnail(data.profile_image_url));
    }
}
