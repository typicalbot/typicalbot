const Event = require("../structures/Event");

class GuildDelete extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild) {
        if (!guild.available) return;

        if (this.client.build === "stable") this.client.sendStatistics(guild.shardID);

        this.client.handlers.tasks.create('deleteSettings', Date.now() + 604800000, { guild: guild.id });
    }
}

module.exports = GuildDelete;
