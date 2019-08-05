const r = require("rethinkdbdash");
const credentials = require(`${process.cwd()}/config`).database.credentials;

class DatabaseHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        this.connection = r(credentials);
    }

    get(table, key) {
        return key ?
            this.connection.table(table).get(key) :
            this.connection.table(table);
    }

    async has(table, key) {
        return !!(await this.connection.table(table).get(key));
    }

    insert(table, data) {
        return this.connection.table(table).insert(data);
    }

    update(table, key, data) {
        return this.connection.table(table).get(key).update(data);
    }

    delete(table, key) {
        return this.connection.table(table).delete(key);
    }
}

module.exports = DatabaseHandler;