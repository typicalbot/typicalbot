const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    async execute() {
        const database = this.client.handlers.database.connection;
        const data = await database.table("donors") || await database.db("data").table("donors") || {};

        data.forEach(e => {
            if (e.id.length > 5) this.client.caches.donors.set(e.id, e);
        });

        return this.client.caches.donors;
    }
}

module.exports = New;
