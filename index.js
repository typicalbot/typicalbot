console.log("A");

//const { Collection } = require("discord.js");
const API = require("./api/app");
const config = require(`./config`);

const Shard = require("./Shard");

console.log("B");

class ShardingMaster extends Collection {
    constructor() {
        super();

        this.stats = [];

        this.config = config;

        this.api = new API(this);

        this.pendingRequests = new Collection();

        for (let s = 0; s < config.shards; s++) {
            console.log("C" + s);
            setTimeout(() => this.set(s, new Shard(this, s, config.shards)), (9000 * s));
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
