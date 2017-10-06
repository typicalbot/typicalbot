const { Client } = require("discord.js");

const build = process.env.CLIENT_BUILD;
const config = require(`../configs/${this.build}`);

const EventStore = require("./stores/Events.js");

class TypicalBot extends Client {
    constructor() {
        super(config.clientOptions);

        this.build = build;
        this.config = config;

        this.shardID = Number(process.env.SHARD_ID);
        this.shardNumber = Number(process.env.SHARD_ID) + 1;
        this.shardCount = Number(process.env.SHARD_COUNT);

        this.events = new EventStore(this);
    }
}
