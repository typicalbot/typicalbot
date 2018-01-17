const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild, message, user) {
        this.client.handlers.process.transmitStat("voiceConnections");
    }
}

module.exports = New;
