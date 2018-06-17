const { fork } = require("child_process");

class Shard extends fork {
    constructor(handler, shardID, shardCount) {
        super(`${process.cwd()}/src/client`, [], { env: { SHARD_ID: shardID, SHARD_COUNT: shardCount } });

        this.handler = handler;

        this.id = shardID;

        this.stats = {};

        this.on("message", message => {
            const { event, data } = message;

            if (event === "stats") {
                Object.keys(data).map(key => this.stats[key] = data[key]);

                this.handler.broadcast("stats", this.handler.stats);
            } else {
                this.master.broadcast(event, data);
            }
        });
    }
}

module.exports = Shard;
