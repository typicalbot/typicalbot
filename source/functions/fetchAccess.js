const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(guild) {
        const owner = guild.owner ? guild.owner.user : guild.member(guild.ownerID).user;

        const permissionLevel = this.client.handlers.permissions.fetch(guild, owner);

        if (permissionLevel.level > 5) return { "level": 3, "title": "TypicalBot Staff" };

        if (this.client.config.partners[owner.id]) return { "level": 2, "title": "TypicalBot Partner" };

        if (this.client.caches.donors.has(owner.id) && this.client.caches.donors.get(owner.id).amount >= 5) return { "level": 1, "title": "TypicalBot Donor" };

        return { "level": 0, "title": "Default" };
    }
}

module.exports = New;
