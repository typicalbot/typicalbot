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
    constructor(manager, id) {
        super(path, [], { env: { SHARD_ID: id, SHARD_COUNT, CLIENT_TOKEN, CLIENT_VR: vr } });

        this.id = id;

        this.stats = {};

        this.manager = manager;

        this.on("message", message => {
            if (message.type === "stat") return this.manager.changeStats(this.id, message.data);
            if (message.type === "request") {
                let toShard = manager.shards.get(message.data.to);
                if (!toShard) return this.send({ "type": "request", "data": { "id": message.data.id, "error": "InvalidShard" } });

                let listener = msg => {
                    if (msg.type !== "request" || msg.data.id !== message.data.id) return;
                    this.removeListener("message", listener);
                };
                this.on("message", listener);

                toShard.send(message);
            }
            return this.manager.transmit(message.type, message.data);
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

    inGuild(guildid) {
        return new Promise((resolve, reject) => {
            request.get(`https://discordapp.com/api/v6/guilds/${guildid}`)
            .set("Authorization", `Bot ${config.token}`)
            .end((err, res) => {
                if (res.statusCode === 200) return resolve();
                return reject();
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
