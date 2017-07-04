const rt = require("rethinkdbdash");
const vr = require("../../version").version;
const options = require(`../../Configs/${vr}`).rethinkdb;

class Database {
    constructor() {
        this.db = rt(options);
    }

    get(table, key) {
        return this.db.table(table).get(key);
    }

    async has(table, key) {
        return !!(await this.db.get(table, key));
    }

    insert(table, data) {
        return this.db.table(table).insert(data);
    }

    update(table, key, object){
        return this.db.table(table).get(key).update(object);
    }

    delete(table, key) {
        return this.db.table(table).delete(key);
    }
}

module.exports = Database;
