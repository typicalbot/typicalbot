const Function = require('../structures/Function');
const Constants = require('../utility/Constants');

class FetchAccess extends Function {
    constructor(client, name) {
        super(client, name);
    }

    async execute(guild) {
        const owner = (guild.owner || await guild.members.fetch(guild.ownerID)).user;

        if ((await guild.fetchPermissions(owner)).level > 5) return Constants.Access.Titles.STAFF;

        if (this.client.caches.donors.has(owner.id) && this.client.caches.donors.get(owner.id).amount >= 5) return Constants.Access.Titles.DONOR;

        return Constants.Access.Titles.DEFAULT;
    }
}

module.exports = FetchAccess;
