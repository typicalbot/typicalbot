const r             = require("rethinkdbdash");
const credentials   = require(`../../configs/${process.env.CLIENT_BUILD}`).rethinkdb;

class DatabaseHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        this.connection = r(credentials);
    }

    get(table, key) {
        let query = this.connection.table(table);
        if (key) query = query.key(key);

        return query;
    }

    async has(table, key) {
        const query = await this.connection.table(table).get(key);

        return !!query;
    }

    insert(table, data) {
        const query = this.connection.table(table).insert(data);

        return query;
    }

    update(table, key, data){
        const query = this.connection.table(table).get(key).update(data);

        return query;
    }

    delete(table, key) {
        const query = this.connection.table(table).delete(key);

        return query;
    }
}

module.exports = DatabaseHandler;