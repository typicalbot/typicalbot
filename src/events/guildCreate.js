const Event = require("../structures/Event");

class GuildCreate extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild) {
        if (!guild.available) return;

        if (this.client.build === "stable") {
            this.client.datadog.increment("typicalbot.guildcreate");
            this.client.sendStatistics(guild.shardID);
        }
    }
}

module.exports = GuildCreate;
