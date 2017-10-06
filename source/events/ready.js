const Event = require("../structures/Event");

module.exports = class extends Event {
    constructor(client) {
        super(client);

        this.client = client;
    }

    execute() {
        this.client.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.user.setActivity(`Client Started`);
    }
};
