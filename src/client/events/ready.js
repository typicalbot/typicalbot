const Event = require("../structures/Event");

class Ready extends Event {
    constructor(...args) {
        super(...args);

        this.once = true;
    }

    async execute() {
        this.client.handlers.process.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.user.setActivity(`Client Started`);
        this.client.functions.fetchDonors();

        this.intervals.push(setInterval(async () => {
            this.client.user.setActivity(`${this.client.config.prefix}help | ${await this.client.handlers.process.fetchShardProperties("guilds.size")} Servers`);
        }, 1000 * 60 * 5));

        this.intervals.push(setInterval(() => {
            this.client.voiceConnections.filter(c => c.channel.members.filter(m => !m.user.bot).size === 0).forEach(c => c.guildStream ? c.guildStream.end() : c.disconnect());
        }, 1000 * 30));
    }
}

module.exports = Ready;
