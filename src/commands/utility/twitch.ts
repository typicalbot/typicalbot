/* eslint-disable @typescript-eslint/naming-convention */
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { TypicalGuildMessage } from '../../lib/types/typicalbot';

export default class extends Command {
    async execute(message: TypicalGuildMessage, parameters: string) {
        if (!parameters)
            return message.error(message.translate('misc:USAGE_ERROR', {
                name: this.name,
                prefix: this.client.config.prefix
            }));

        const json = await fetch(`https://api.twitch.tv/helix/users?login=${parameters}`, {
            method: 'get',
            headers: { 'Client-ID': this.client.config.apis.twitch }
        })
            .then((res) => res.json())
            .catch(() => null);

        if (!json || !json.data?.length)
            return message.error(message.translate('common:REQUEST_ERROR'));

        const [data] = json.data;
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

        const NA = message.translate('common:NA');

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle('Twitch Statistics')
            .setDescription(data.description)
            .addFields([
                {
                    name: message.translate('common:ID_FIELD'),
                    value: data.id || NA,
                    inline: true
                },
                {
                    name: message.translate('common:DISPLAYNAME_FIELD'),
                    value: data.display_name || NA,
                    inline: true
                },
                {
                    name: message.translate('common:STATUS_FIELD'),
                    value: data.broadcaster_type || NA,
                    inline: true
                },
                {
                    name: message.translate('common:TOTALVIEWS'),
                    value: data.view_count || NA,
                    inline: true
                }
            ])
            .setThumbnail(data.profile_image_url));
    }
}
