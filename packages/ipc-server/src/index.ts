import { NetworkError, NodeMessage, Server, ServerSocket } from 'veza';

const node = new Server('manager');

node.on('connect', (client: ServerSocket) => {
    console.log(`[IPC] Client connected: ${client.name}`);
});

node.on('disconnect', (client: ServerSocket) => {
    console.log(`[IPC] Client disconnected: ${client.name}`);
});

node.on('error', (error: Error | NetworkError, client: ServerSocket | null) => {
    console.error(`[IPC] Client error: ${client?.name ?? 'unknown'}`, error);
});

node.on('message', async (message: NodeMessage) => {
    const { event, data } = message.data;

    if (event === 'collectData') {
        const sockets = Array.from(node.sockets);
        const results = await Promise.all(
            sockets.filter(c => /\d+$/.test(c[0]))
                .map(s => s[1].send({
                    event: 'collectData',
                    data
                }, { receptive: true }))
        );

        message.reply((results as unknown as string[]).reduce((a, b) => a + b));
    }

    if (event === 'sendTo') {
        const reply = await node.sendTo(message.data.to, data, { receptive: true });

        message.reply(reply);
    }
});

node.listen(process.env.PORT ?? 4000).catch(console.error);
