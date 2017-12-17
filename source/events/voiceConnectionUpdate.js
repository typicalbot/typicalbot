const Event = require("../structures/Event");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(guild, message, user) {
        this.client.transmitStat("voiceConnections");
    }
}

module.exports = New;
