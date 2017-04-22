const cp            = require("child_process");
const pathModule    = require("path");
const vr            = require("./version").version;
const config        = require(`./Configs/${vr}`);
const Discord       = require("discord.js");
const request       = require("superagent");

const SHARD_COUNT   = config.shards;
const CLIENT_TOKEN  = config.token;

const Webserver     = require("./Express/app");

const path          = pathModule.join(__dirname, `Source`, `client.js`);

class Shard extends cp.fork {
    constructor(master, id) {
        super(path, [], { env: { SHARD_ID: id, SHARD_COUNT, CLIENT_TOKEN, CLIENT_VR: vr } });

        this.id = id;

        this.stats = {};

        this.master = master;

        this.on("message", message => {
            if (message.type === "stat") {
                this.master.changeStats(this.id, message.data);
            } else if (message.type === "masterrequest") {
                let r = this.master.pendingRequests.get(message.data.id);
                if (!r) return;
                clearTimeout(r.timeout);
                r.r(message);
            } else if (message.type === "request") {
                let toShard = this.master.shards.get(message.data.to);
                if (!toShard) return this.send({ "type": "request", "data": { "id": message.data.id, "error": "InvalidShard" } });

                let listener = msg => {
                    if (msg.type !== "request" || msg.data.id !== message.data.id) return;
                    this.removeListener("message", listener);
                };
                this.on("message", listener);

                toShard.send(message);
            } else {
                this.master.transmit(message.type, message.data);
            }
        });
    }
}

new class {
    constructor() {
        this.shards = new Discord.Collection();
        this.stats = [];
        this.pendingRequests = new Discord.Collection();

        this.webserver = new Webserver(this, config);

        this.init();
    }

    userLevel(userid) {
        if (userid === config.owner) return 10;
        if (config.management[userid]) return 9;
        if (userid === config.devhelp) return 8;
        if (config.staff[userid]) return 7;
        if (config.support[userid]) return 6;
    }

    guildUserLevel(guildid, userid) {
        return new Promise((resolve, reject) => {
            let r_id = Math.random();

            let timeout = setTimeout(() => {
                this.pendingRequests.delete(r_id);
                return reject("Timed out");
            }, 5000);

            let r = (response) => {
                this.pendingRequests.delete(r_id);
                return resolve(response.data);
            };

            this.pendingRequests.set(r_id, { r, timeout });
            this.transmit("userlevel", {
                id: r_id,
                guildid,
                userid
            });
        });
    }

    inGuild(guildid) {
        return new Promise((resolve, reject) => {
            let r_id = Math.random();

            let timeout = setTimeout(() => {
                this.pendingRequests.delete(r_id);
                return reject("Timed out");
            }, 5000);

            let r = (response) => {
                this.pendingRequests.delete(r_id);
                return resolve(response.data);
            };

            this.pendingRequests.set(r_id, { r, timeout });
            this.transmit("inguild", {
                id: r_id,
                guildid
            });
        });
    }

    guildInformation(guildid) {
        return new Promise((resolve, reject) => {
            let r_id = Math.random();

            let timeout = setTimeout(() => {
                this.pendingRequests.delete(r_id);
                return reject();
            }, 5000);

            let r = (response) => {
                this.pendingRequests.delete(r_id);
                return resolve(response.data);
            };

            this.pendingRequests.set(r_id, { r, timeout });
            this.transmit("guildinfo", {
                id: r_id,
                guildid
            });
        });
    }

    makeRequest(from, to, request) {
        this.shards.get(to).send({
            "type": "request"
        });
    }

    create(id) {
        this.shards.set(id, new Shard(this, id));
    }

    changeStats(shard, data) {
        Object.keys(data).map(key => this.shards.get(shard).stats[key] = data[key]);
        this.relayStats();
    }

    relayStats() {
        let data = {};
        this.shards.forEach(shard => {
            Object.keys(shard.stats).forEach(key => {
                data[key] ? data[key] += shard.stats[key] : data[key] = shard.stats[key];
            });
        });
        this.transmit("stats", data);
    }

    transmit(type, data) {
        this.shards.forEach(shard => {
            shard.send({
                type,
                data
            });
        });
    }

    init() {
        for (let s = 0; s < SHARD_COUNT; s++) {
            setTimeout(this.create.bind(this), (9000 * s), s);
        }
    }
};
