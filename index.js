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

        this.commands = Array(60).fill(0);

        this.master = master;

        this.status = null;
        this.uptime = null;

        this.on("message", message => {
            if (message.type === "stat" || message.type === "stats") {
                this.master.changeStats(this.id, message.data);
            } else if (message.type === "commands") {
                this.commands = message.data.commands;
            } else if (message.type === "status") {
                this.status = message.data.status;
                this.uptime = message.data.uptime;
            } else if (message.type === "masterrequest") {
                const r = this.master.pendingRequests.get(message.data.id);
                if (!r) return;
                r.callback(message);
            } else if (message.type === "donors") {
                this.master.donorData = message.data;
                this.master.transmit(message.type, message.data);
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

        this.donorData = [];

        this.webserver = new Webserver(this, config);

        this.init();
    }

    staff(userid) {
        if (
            userid === config.owner ||
            config.management[userid] ||
            userid === config.devhelp ||
            config.staff[userid] ||
            config.support[userid]
        ) return true;
        return false;
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

            this.transmit(request, Object.assign(data, { id }));
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
        const data = {};
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
