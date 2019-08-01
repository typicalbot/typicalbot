const { fork } = require("child_process");

class Shard extends fork {
    constructor(handler, shardID, shardCount) {
        super(`${process.cwd()}/src/client`, [], { env: { SHARDS: shardID, TOTAL_SHARD_COUNT: shardCount } });

        this.handler = handler;

        this.id = shardID;

        this.on("message", async ({ event, data }) => {
            if (event === "fetchProperty") {
                this.send({
                    event: "returnrequest",
                    data: {
                        id: data.id,
                        response: await this.handler.fetchShardProperties(data.property)
                    }
                });
            } else if (event === "masterrequest") {
                if (!this.handler.pendingRequests.has(data.id)) return;

                this.handler.pendingRequests.get(data.id).callback(data);
            } else {
                this.handler.broadcast(event, data);
            }
        });
    }
}

module.exports = Shard;
