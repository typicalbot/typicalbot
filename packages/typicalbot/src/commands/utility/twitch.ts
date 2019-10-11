import fetch from 'node-fetch';
import Command from '../../structures/Command';
import { TypicalGuildMessage } from '../../types/typicalbot';
import { MessageEmbed } from 'discord.js';

const regex = /(.*)/gi;

export default class extends Command {

    async execute(message: TypicalGuildMessage, parameters: string) {
        const args =regex.exec(parameters);
        if (!args) return message.error(message.translate('misc:USAGE_ERROR', {
            name: this.name,
            prefix: this.client.config.prefix
        }));
        args.shift();
        const [name] = args;

        const json = await fetch(`https://api.twitch.tv/helix/users?login=${name}`, { method: 'get', headers: { 'Client-ID': this.client.config.apis.twitch } })
            .then((res) => res.json())
            .catch(() => null);

        if (!json) return message.error(message.translate('common:REQUEST_ERROR'));


        const data = json.data[0];
        if (!message.embedable) return message.reply([
            message.translate('twitch:STATS', { name: data.display_name }),
            '```',
            message.translate('twitch:ID', { id: data.id }),
            message.translate('twitch:DISPLAY', { name: data.display_name }),
            message.translate('twitch: DESC', { description: data.description }),
            message.translate('twitch:STATUS', { type: data.broadcaster_type }),
            message.translate('twitch:PROFILE', { url: data.profile_image_url }),
            message.translate('twitch:VIEWS', { amount: data.view_count }),
            '```'
        ].join('\n'));

        return message.send(new MessageEmbed()
            .setColor(0x00adff)
            .setTitle('Twitch Statistics')
            .setDescription(data.description)
            .addField(message.translate('common:ID_FIELD'), data.id, true)
            .addField(message.translate('common:DISPLAYNAME_FIELD'), data.display_name, true)
            .addField(message.translate('common:STATUS_FIELD'), data.broadcaster_type, true)
            .addField(message.translate('common:TOTALVIEWS_FIELD'), data.view_count, true)
            .setThumbnail(data.profile_image_url)
        )
    }
};
