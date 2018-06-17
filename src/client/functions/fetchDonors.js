const Function = require("../structures/Function");

class FetchDonors extends Function {
    constructor(client, name) {
        super(client, name);
    }

    async execute() {
        (await this.client.handlers.database.connection.table("donors")).forEach(e => {
            if (e.id.length > 5) this.client.caches.donors.set(e.id, e);
        });

        return this.client.caches.donors;
    }
}

module.exports = FetchDonors;
