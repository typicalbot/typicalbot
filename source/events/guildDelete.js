const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild) {
        if (!guild.available) return;
        
        this.client.handlers.process.transmitStats();
    }
}

module.exports = New;
