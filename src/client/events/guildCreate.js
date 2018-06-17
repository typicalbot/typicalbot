const Event = require("../structures/Event");

class GuildCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild) {
        if (!guild.available) return;

        if (this.client.build === "stable") this.client.functions.postStats("a");

        this.client.handlers.process.transmitStats();
    }
}

module.exports = GuildCreate;
