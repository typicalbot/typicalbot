const Function = require("../structures/Function");

class FetchAutoRole extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(guild, settings) {
        const id = settings.auto.role.id;

        return id ?
            guild.roles.has(id) ?
                guild.roles.get(id) :
                null :
            null;
    }
}

module.exports = FetchAutoRole;
