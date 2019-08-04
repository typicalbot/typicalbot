const Event = require("../structures/Event");

class Ready extends Event {
    constructor(...args) {
        super(...args);

        this.once = true;
    }

    async execute() {
        console.log(`Client Connected | Cluster ${this.client.cluster}`);
        this.client.user.setActivity(`Client Started`);
        this.client.functions.fetchDonors();

        this.intervals.push(setInterval(async () => {
            this.client.user.setActivity(`${this.client.config.prefix}help — typicalbot.com`, { type: 'WATCHING' });
        }, 1000 * 60 * 5));

        this.intervals.push(setInterval(() => {
            this.client.voice.connections.filter(c => c.channel.members.filter(m => !m.user.bot).size === 0).forEach(c => c.guildStream ? c.guildStream.end() : c.disconnect());
        }, 1000 * 30));
    }
}

module.exports = Ready;
