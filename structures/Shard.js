const { fork } = require("child_process");

class Shard extends fork {
    constructor(master, SHARD_ID, SHARD_COUNT, CLIENT_TOKEN, CLIENT_BUILD) {
        super(`${process.cwd()}/source/client.js`, [], { env: { SHARD_ID, SHARD_COUNT, CLIENT_TOKEN, CLIENT_BUILD } });

        this.master = master;

        this.id = SHARD_ID;

        this.stats = {};

        this.on("message", message => {
            const { type, data } = message;
            
            if (type === "stats") {
                this.master.updateStats(this.id, message.data);
            } else {
                this.master.broadcast(message.type, message.data);
            }
        });
    }
}

module.exports = Shard;