const { Node } = require("veza");

const node = new Node("manager")
    .on('error', (error, client) => console.error(`[IPC] Error from ${client.name}`, error))
    .on('client.identify', client => console.log(`[IPC] Client Connected: ${client.name}`))
    .on('client.destroy', client => console.log(`[IPC] Client Destroyed: ${client.name}`))
    .on('message', async message => {
        const { event, data } = message.data;

        if (event === "collectData") {
            message.reply(
                await Promise
                .all(Array.from(node.server.clients)
                .map(s => s[1].send({
                    event: "collectData",
                    data
                }, { receptive: true })))
                .then(results => results.reduce((a, c) => a + c))
            );
        } else if (event === "ready") {
            console.log(message.data.message);
        }
    });

node.serve(4000).catch(error => console.error('[IPC] Disconnected!', error));