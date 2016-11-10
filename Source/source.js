const Client = require("./Client");
const client = new Client();

process
    .on("message", message => client.events.processMessage(message))
    .on("unhandledRejection", (reason, p) => console.error('Unhandled Rejection at: Promise', p, 'reason:', reason));
