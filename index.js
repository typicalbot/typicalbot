const config = require("./config");

const API = require("./api/app");

const { Collection } = require("discord.js");
const Shard = require("./src/Shard");

function fetchShardProperties(shard, property) {
    return new Promise((resolve, reject) => {
        const id = Math.random();

        const listener = ({ event, data }) => {
            if (event !== "globalrequest" || data.id !== id) return;

            shard.removeListener("message", listener);
            return resolve(data.response);
        };

        shard.on("message", listener);
        shard.send({ event: "fetchProperty", data: { property: property, id } });
    });
}

class ShardHandler extends Collection {
    constructor() {
        super();

        this.config = config;

        this.api = new API(this);

        this.pendingRequests = new Collection();

        for (let s = 0; s < config.shards; s++)
            setTimeout(() => this.set(s, new Shard(this, s, config.shards)), (8000 * s));
    }

    fetchShardProperties(property) {
        return Promise
            .all(this.map(s => fetchShardProperties(s, property)))
            .then(results => results.reduce((a, c) => a + c));
    }

    globalRequest(request, data) {
        return new Promise((resolve, reject) => {
            const id = Math.random();

            const timeout = setTimeout(() => {
                this.pendingRequests.delete(id);

                return reject("Timed Out");
            }, 500);

            const callback = (response) => {
                clearTimeout(timeout);

                this.pendingRequests.delete(id);

                return resolve(response);
            };

            this.pendingRequests.set(id, { callback, timeout });

            this.broadcast(request, Object.assign(data, { id }));
        });
    }

    broadcast(event, data) {
        this.forEach(shard => shard.send({ event, data }));
    }
}

new ShardHandler();