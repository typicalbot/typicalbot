import * as Sentry from '@sentry/node';
import { Collection, TextChannel, MessageEmbed } from 'discord.js';
import moment from 'moment';
import fetch from 'node-fetch';
import Event from '../lib/structures/Event';
import { TypicalGuildMessage } from '../lib/types/typicalbot';

async function hastebin(input: string) {
    const options = { url: 'https://www.hastebin.com', extension: 'js' };

    const res = await fetch(`${options.url}/documents`, {
        method: 'post',
        body: input,
        headers: { 'Content-Type': 'text/plain' }
    });

    if (!res.ok) console.error(res.statusText);

    const { key } = await res.json();

    return `${options.url}/${key}.${options.extension}`;
}

export default class MessageBulkDelete extends Event {
    async execute(messages: Collection<string, TypicalGuildMessage>) {
        const message = messages.first();

        if (
            !message ||
            message.channel.type !== 'text' ||
            !message.guild.available
        )
            return;

        const settings = await this.client.settings.fetch(message.guild.id);

        if (!settings.logs.id || !settings.logs.delete) return;

        const logsChannel = message.guild.channels.cache.get(settings.logs.id) as TextChannel;
        if (!logsChannel || logsChannel.type !== 'text') return;

        const haste = await hastebin(messages
            .map((m) =>
                `${moment(m.createdAt).format('dddd MMMM Do, YYYY, hh:mm A')} | ${m.author.tag} (${m.author.id}):\n${m.content}`)
            .join('\n\n--  --  --  --  --\n\n'));

        if (settings.logs.delete !== '--embed')
            return logsChannel
                .send(message.translate('help/logs:BULK_DELETED', {
                    amount: messages.size,
                    channel: message.channel.toString(),
                    id: message.channel.id,
                    url: haste
                }))
                .catch((err) => Sentry.captureException(err));

        return logsChannel
            .send(new MessageEmbed()
                .setColor(0x3ea7ed)
                .setDescription(message.translate('help/logs:PURGED', {
                    amount: messages.size,
                    url: haste
                }))
                .setFooter(message.translate('help/logs:MESSAGES_PURGED', {
                    channel: message.channel.toString(),
                    id: message.channel.id
                }))
                .setTimestamp())
            .catch((err) => Sentry.captureException(err));
    }
}
