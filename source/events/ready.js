const Event = require("../structures/Event");

class Ready extends Event {
    constructor(client, name) {
        super(client, name);
    }

    execute() {
        this.client.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.user.setActivity(`Client Started`);
    }
}

module.exports = Ready;
