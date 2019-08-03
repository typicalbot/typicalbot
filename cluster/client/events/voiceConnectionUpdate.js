const Event = require("../structures/Event");

class VoiceConnectionUpdate extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(guild, message, user) {
        
    }
}

module.exports = VoiceConnectionUpdate;
