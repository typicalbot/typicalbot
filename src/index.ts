/* eslint-disable no-console */
import dotenv from 'dotenv';
import fs from 'fs';
import { Client, ClientSocket, NodeMessage } from 'veza';
import TypicalClient from './lib/TypicalClient';

dotenv.config();

fs.mkdir('data', (err) => {
    if (err && err.code !== 'EEXIST') console.error(err);
});

if (process.env.CLUSTERED !== 'true') {
    new TypicalClient(undefined);
} else {
    const node = new Client(process.env.CLUSTER ?? 'TypicalBot')
        .on('error', (error: Error, client: ClientSocket) =>
            console.error(`[IPC] Error from ${client.name}:`, error))
        .on('disconnect', (client: ClientSocket) =>
            console.error(`[IPC] Disconnected from ${client.name}`))
        .on('ready', async (client: ClientSocket) => {
            console.log(`[IPC] Connected to: ${client.name}`);
        });

    node.connectTo(process.env.NODE_PORT!).catch((error) =>
        console.error('[IPC] Disconnected!', error));

    const client = new TypicalClient(node);

    // eslint-disable-next-line consistent-return
    node.on('message', async (message: NodeMessage) => {
        if (message.data.event === 'collectData') {
            // eslint-disable-next-line no-eval
            message.reply(eval(`client.${message.data.data}`));
        } else if (message.data.event === 'shardCount') {
            message.reply(client.shardCount);
        }
    });
}
