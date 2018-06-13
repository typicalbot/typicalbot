const config = require("./config");

const { Collection } = require("discord.js");
const Shard = require("./src/Shard");

class ShardHandler extends Collection {
    constructor() {
        super();

        this.config = config;

        for (let s = 0; s < config.shards; s++)
            setTimeout(() => this.set(s, new Shard(this, s, config.shards)), (8000 * s));
    }

    get stats() {
        const data = {};

        this.forEach(shard => Object.keys(shard.stats).forEach(key => data[key] ? data[key] += shard.stats[key] : data[key] = shard.stats[key]));

        return data;
    }

    broadcast(event, data) {
        this.forEach(shard => shard.send({ event, data }));
    }
}

new ShardHandler();