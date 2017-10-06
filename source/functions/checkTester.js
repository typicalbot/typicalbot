const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(guild) {
        if (!this.client.testerData.includes(guild.ownerID) &&
            guild.ownerID !== this.client.config.owner &&
            !this.client.config.administrators[guild.ownerID] &&
            !this.client.config.support[guild.ownerID]
        ) return false;
        return true;
    }
}

module.exports = New;
