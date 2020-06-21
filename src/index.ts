/* eslint-disable no-console */
import fs from 'fs';
import { TextChannel } from 'discord.js';
import { Client, ClientSocket, NodeMessage } from 'veza';
import Cluster from './lib/TypicalClient';
import config from '../etc/config.json';

fs.mkdir('data', (err) => {
    if (err && err.code !== 'EEXIST') console.error(err);
});

if (!config.clustered) {
    new Cluster(undefined);
} else {
    const node = new Client(process.env.CLUSTER ?? 'TypicalBot')
        .on('error', (error: Error, client: ClientSocket) =>
            console.error(`[IPC] Error from ${client.name}:`, error))
        .on('disconnect', (client: ClientSocket) =>
            console.error(`[IPC] Disconnected from ${client.name}`))
        .on('ready', async (client: ClientSocket) => {
            console.log(`[IPC] Connected to: ${client.name}`);
        });

    node.connectTo(config.nodePort).catch((error) =>
        console.error('[IPC] Disconnected!', error));

    const client = new Cluster(node);

    // eslint-disable-next-line consistent-return
    node.on('message', async (message: NodeMessage) => {
        if (message.data.event === 'collectData') {
            // eslint-disable-next-line no-eval
            message.reply(eval(`client.${message.data.data}`));
        } else if (message.data.event === 'shardCount') {
            message.reply(client.shardCount);
        } else if (message.data.event === 'channelEmbed') {
            const { apiKey, channel, json } = message.data;

            const guild = Buffer.from(apiKey.split('.')[0], 'base64').toString('utf-8');

            const trueGuild = client.guilds.cache.get(guild);
            if (!trueGuild)
                return message.reply({ response: "Guild doesn't exist." });

            const settings = await client.settings.fetch(guild);
            const trueApiKey = settings.apikey;

            if (apiKey !== trueApiKey)
                return message.reply({ response: 'Invalid API key.' });

            if (!trueGuild.channels.cache.has(channel))
                return message.reply({ response: "Channel doesn't exist." });

            const trueChannel = trueGuild.channels.cache.get(channel);
            if (trueChannel instanceof TextChannel) {
                const botPerms = trueChannel.permissionsFor(config.id);
                if (
                    !botPerms ||
                    !botPerms.has(['VIEW_CHANNEL', 'SEND_MESSAGES'])
                )
                    return message.reply({
                        response:
                            'Missing permissions to read or send on this channel.'
                    });

                return trueChannel
                    .send('', json)
                    .then(() => message.reply({ response: 'Success' }))
                    .catch(() =>
                        message.reply({ response: 'An error occurred.' }));
            }

            return message.reply({
                response: 'Invalid channel type provided.'
            });
        }
    });
}
