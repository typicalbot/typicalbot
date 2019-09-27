/* eslint-disable no-console */
import { Client, ClientSocket, NodeMessage } from 'veza';
import { TextChannel } from 'discord.js';
import Cluster from './packages/typicalbot/src';
import * as config from './config.json';

const node = new Client(process.env.CLUSTER)
    .on('error', (error: Error, client: ClientSocket) => console.error(`[IPC] Error from ${client.name}:`, error))
    .on('disconnect', (client: ClientSocket) => console.error(`[IPC] Disconnected from ${client.name}`))
    .on('ready', async (client: ClientSocket) => {
        console.log(`[IPC] Connected to: ${client.name}`);
    });

node.connectTo(config.nodePort).catch((error) => console.error('[IPC] Disconnected!', error));

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

        if (!client.guilds.has(guild)) return message.reply({ response: "Guild doesn't exist." });

        const settings = await client.settings.fetch(guild);
        const trueApiKey = settings.apikey;

        if (apiKey !== trueApiKey) return message.reply({ response: 'Invalid API key.' });

        const trueGuild = client.guilds.get(guild);

        if (!trueGuild.channels.has(channel)) return message.reply({ response: "Channel doesn't exist." });

        const trueChannel = trueGuild.channels.get(channel);
        if (trueChannel instanceof TextChannel) {
            if (!trueChannel.permissionsFor(trueGuild.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) return message.reply({ response: "Missing permissions to read or send on this channel." });
            
            return trueChannel.send('', json).then(() => message.reply({ response: 'Success' })).catch(() => message.reply({ response: 'An error occured.' }));
        }

        return message.reply({ response: "Invalid channel type provided." })
    }
});
