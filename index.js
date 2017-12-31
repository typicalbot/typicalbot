require.extensions['.txt'] = function (module, filename) { module.exports = require("fs").readFileSync(filename, 'utf8'); };

const { Collection } = require("discord.js");

const IPC = require("./ipc/app");

const build = require("./build");
const config = require(`./configs/${build}`);

const SHARD_COUNT   = config.shards;
const CLIENT_TOKEN  = config.token;

const Shard = require("./structures/Shard");

class ShardingMaster extends Collection {
    constructor() {
        super();

        this.stats = [];

        if (build === "development") this.ipc = new IPC(this);

        this.pendingRequests = new Collection();

        for (let s = 0; s < SHARD_COUNT; s++) {
            setTimeout(() => this.set(s, new Shard(this, s, SHARD_COUNT, CLIENT_TOKEN, build)), (9000 * s));
        }
    }

    globalRequest(request, data) {
        return new Promise((resolve, reject) => {
            const id = Math.random();

            const timeout = setTimeout(() => { this.pendingRequests.delete(id); return reject("Timed Out"); }, 100);

            const callback = (response) => {
                clearTimeout(timeout);

                this.pendingRequests.delete(id);

                return resolve(response.data);
            };

            this.pendingRequests.set(id, { callback, timeout });

            this.broadcast(request, Object.assign(data, { id }));
        });
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

        this.stats = newData;

        this.broadcast("stats", newData);
    }
}

new ShardingMaster();
