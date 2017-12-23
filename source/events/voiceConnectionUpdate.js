const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild, message, user) {
        this.client.transmitStat("voiceConnections");
    }
}

module.exports = New;
