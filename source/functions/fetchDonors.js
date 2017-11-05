const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    async execute() {
        const data = await this.client.database.db.db("data").table("donors");

        data.forEach(e => {
            if (e.id.length > 5) this.client.donors.set(e.id, e);
        });

        return this.client.donors;
    }
}

module.exports = New;
