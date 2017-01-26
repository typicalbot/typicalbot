module.exports = class GuildVoice {
    constructor(connection) {
        this.connection = connection;
        this.queue = [];
    }
};
