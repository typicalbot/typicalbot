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

        setInterval(() => {
            this.client.user.setActivity(`${this.client.config.prefix}help | ${this.client.shardData.guilds} Servers`);

            if (this.client.guilds.has("163038706117115906")) {
                this.client.functions.transmitDonors();
                this.client.functions.transmitTesters();
            }
        }, 1000 * 60 * 5);
    }
}

module.exports = New;
