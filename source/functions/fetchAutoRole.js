const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(guild, settings) {
        const roleSetting = settings.auto.role.id; if (!roleSetting) return;

        if (guild.roles.has(roleSetting)) return guild.roles.get(roleSetting);
        return;
    }
}

module.exports = New;
