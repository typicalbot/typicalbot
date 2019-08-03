const Function = require("../structures/Function");

class MatchPrefix extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(user, settings, command) {
        if (command.startsWith(this.client.config.prefix) && user.id === this.client.config.owner) return this.client.config.prefix;
        if (settings.prefix.custom && command.startsWith(settings.prefix.custom)) return settings.prefix.custom;
        if (settings.prefix.default && command.startsWith(this.client.config.prefix)) return this.client.config.prefix;
        
        return null;
    }
}

module.exports = MatchPrefix;
