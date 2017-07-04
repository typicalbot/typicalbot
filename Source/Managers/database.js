const rt = require("rethinkdbdash");

class Database {
    constructor(options) {
        this.db = rt({ "db": "tb_development" });
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

    update(table, key, column, value){
        return this.get(table, key).update({ [column]: value });
    }

    delete(table, key) {
        return this.db.table(table).delete(key);
    }
}

module.exports = Database;
