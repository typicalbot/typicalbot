const Event = require("../structures/Event");

class GuildDelete extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild) {
        if (!guild.available) return;
    }
}

module.exports = GuildDelete;
