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
        return this.reduce((accumulator, shard) => {
            for (const [key, stat] of Object.entries(shard.stats))
                key in accumulator ?
                    accumulator[key] += stat :
                    accumulator[key] = stat;

            return accumulator;
        }, {});
    }

    broadcast(event, data) {
        this.forEach(shard => shard.send({ event, data }));
    }
}

new ShardHandler();