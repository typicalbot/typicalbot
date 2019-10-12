const Event = require("../structures/Event");

class GuildDelete extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild) {
        if (this.client.build === "stable") this.client.datadog.increment("typicalbot.guilddelete");
    }
}

module.exports = GuildDelete;
