const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(guild) {
        const owner = guild.owner ? guild.owner.user : guild.member(guild.ownerID).user;

        const permissionLevel = this.client.permissionsManager.get(guild, owner);

        if (permissionLevel.level > 5) return { "level": 2, "title": "TypicalBot Staff" };

        if (this.client.donors.has(owner.id) && this.client.donors.get(owner.id).amount >= 5) return { "level": 1, "title": "TypicalBot Donor" };

        return { "level": 0, "title": "Default" };
    }
}

module.exports = New;
