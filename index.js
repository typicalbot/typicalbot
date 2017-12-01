require.extensions['.txt'] = function (module, filename) { module.exports = require("fs").readFileSync(filename, 'utf8'); };

const { Collection } = require("discord.js");

const build = require("./build");
console.log(build);
const config = require(`./configs/${build}`);

const SHARD_COUNT   = config.shards;
const CLIENT_TOKEN  = config.token;

const Shard = require("./structures/Shard");

class ShardingMaster extends Collection {
    constructor() {
        super();
        
        this.stats = [];

        for (let s = 0; s < SHARD_COUNT; s++) {
            setTimeout(() => this.set(s, new Shard(this, s, SHARD_COUNT, CLIENT_TOKEN, build)), (9000 * s));
        }
    }

    broadcast(type, data) {
        this.forEach(shard => {
            shard.send({
                type,
                data
            });
        });
    }

    updateStats(shard, data) {
        Object.keys(data).map(key => this.get(shard).stats[key] = data[key]);

        const newData = {};
        
        this.forEach(shard => {
            Object.keys(shard.stats).forEach(key => {
                newData[key] ? newData[key] += shard.stats[key] : newData[key] = shard.stats[key];
            });
        });

        this.broadcast("stats", newData);
    }
}

new ShardingMaster();