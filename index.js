const { Collection } = require("discord.js");

const { build } = require("./package");
const config = require(`./configs/${build}`);

const SHARD_COUNT   = config.shards;
const CLIENT_TOKEN  = config.token;

const Shard = require("./structures/Shard");

class ShardingMaster {
    constructor() {
        this.shards = new Collection();
        
        this.stats = [];

        this.init();
    }

    create(id) {
        this.shards.set(
            id,
            new Shard(this, id, SHARD_COUNT, CLIENT_TOKEN, build)
        );
    }

    broadcast(type, data) {
        this.shards.forEach(shard => {
            shard.send({
                type,
                data
            });
        });
    }

    updateStats(shard, data) {
        Object.keys(data).map(key => this.shards.get(shard).stats[key] = data[key]);

        const newData = {};
        
        this.shards.forEach(shard => {
            Object.keys(shard.stats).forEach(key => {
                newData[key] ? newData[key] += shard.stats[key] : newData[key] = shard.stats[key];
            });
        });

        this.broadcast("stats", newData);
    }

    init() {
        for (let s = 0; s < SHARD_COUNT; s++) {
            setTimeout(
                this.create.bind(this),
                (9000 * s), s
            );
        }
    }
}

new ShardingMaster();