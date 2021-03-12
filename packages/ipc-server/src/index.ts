import { NetworkError, NodeMessage, Server, ServerSocket } from 'veza';

const server = new Server(process.env.IPC_SERVER_NAME!);

server.on('connect', (client: ServerSocket) => {
    // Discount clients that do not match our specified client name.
    if (!client.name?.startsWith(process.env.IPC_CLIENT_NAME!)) {
        client.disconnect(true);
    }

    console.log(`[IPC] Client connected: ${client.name}`);
});

server.on('disconnect', (client: ServerSocket) => {
    console.log(`[IPC] Client disconnected: ${client.name}`);
});

server.on('error', (error: Error | NetworkError, client: ServerSocket | null) => {
    console.error(`[IPC] Client error: ${client?.name ?? 'unknown'}`, error);
});

server.on('message', async (message: NodeMessage) => {
    const { event, data } = message.data;

    if (event === 'collectData') {
        const sockets = Array.from(server.sockets);
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
        const reply = await server.sendTo(message.data.to, data, { receptive: true });

        message.reply(reply);
    }
});

server.listen(process.env.IPC_SERVER_PORT || 4000).catch(console.error);
