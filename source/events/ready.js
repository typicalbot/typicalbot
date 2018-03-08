const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);

        this.once = true;

        this.intervals = [];
    }

    async execute() {
        this.client.handlers.process.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.user.setActivity(`Client Started`);
        this.client.handlers.process.transmitStats();
        this.client.handlers.process.transmit("transmitTesters");
        this.client.functions.fetchDonors();

        this.intervals.push(setInterval(() => {
            this.client.user.setActivity(`${this.client.config.prefix}help | ${this.client.shards.guilds} Servers`);

            if (this.client.guilds.has("163038706117115906")) {
                this.client.functions.transmitTesters();
            }
        }, 1000 * 60 * 5));

        this.intervals.push(setInterval(() => {
            this.client.voiceConnections.filter(c => c.channel.members.filter(m => !m.user.bot).size === 0).forEach(c => c.guildStream ? c.guildStream.end() : c.disconnect());


            this.client.handlers.process.transmit("stats", {
                ram_used: Math.round(100 * (process.memoryUsage().heapUsed / 1048576)) / 100,
                ram_total: Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100
            });
        }, 1000 * 30));
    }
}

module.exports = New;
