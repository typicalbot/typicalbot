const config = require("./config");

const API = require("./api/app");

const { Collection } = require("discord.js");
const Shard = require("./src/Shard");

class ShardHandler extends Collection {
    constructor() {
        super();

        this.config = config;

        this.api = new API(this);

        this.pendingRequests = new Collection();

        for (let s = 0; s < config.shards; s++)
            setTimeout(() => this.set(s, new Shard(this, s, config.shards)), (8000 * s));
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