const Event = require("../structures/Event");

class New extends Event {
    constructor(client, name) {
        super(client, name);

        this.once = true;
    }

    async execute() {
        this.client.log(`Client Connected | Shard ${this.client.shardNumber} / ${this.client.shardCount}`);
        this.client.user.setActivity(`Client Started`);
        this.client.transmitStats();
        this.client.transmit("transmitDonors");
        this.client.transmit("transmitTesters");

        /*setTimeout(() => {
            if (this.client.build === "prime") this.client.guilds.forEach(g => { if (!this.client.functions.checkDonor(g)) g.leave(); });
            if (this.client.build === "development") this.client.guilds.forEach(g => { if (!this.client.functions.checkTester(g)) g.leave(); });
        }, 1000 * 60);*/

        setInterval(() => this.client.transmitStats(), 1000 * 5);

        setInterval(() => {
            this.client.user.setActivity(`${this.client.config.prefix}help | ${this.client.shardData.guilds} Servers`);

            if (this.client.guilds.has("163038706117115906")) this.client.functions.transmitDonors();
            if (this.client.build === "development" && this.client.guilds.has("163038706117115906")) this.client.functions.transmitTesters();
        }, 1000 * 60 * 5);
    }
}

module.exports = New;
