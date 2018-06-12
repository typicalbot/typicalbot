const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);

        this.once = true;
    }

    async execute() {
        this.client.handlers.process.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.user.setActivity(`Client Started`);
    }
}

module.exports = New;
