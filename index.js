const { Node } = require("veza");
const Cluster = require("./client");

const node = new Node(process.env.CLUSTER)
    .on('error', (error, client) => console.error(`[IPC] Error from ${client.name}:`, error))
    .on('socket.disconnect', client => console.error(`[IPC] Disconnected from ${client.name}`))
    .on('socket.destroy', client => console.error(`[IPC] Client Destroyed: ${client.name}`))
    .on('socket.ready', async client => {
        console.log(`[IPC] Connected to: ${client.name}`);
    });

node.connectTo(4000).catch(error => console.error('[IPC] Disconnected!', error));

const client = new Cluster(node);


node.on("message", message => {
    if (message.data.event === "collectData") {
        message.reply(eval(`client.${message.data.data}`));
    }
});