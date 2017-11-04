const Event = require("../structures/Event");

class New extends Event {
    constructor(client, name) {
        super(client, name);
    }

    async execute(guild) {
        this.client.transmitStats();
    }
}

module.exports = New;
