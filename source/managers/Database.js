const rt = require("rethinkdbdash");
const build = require("../../build");
const options = require(`../../configs/${build}`).rethinkdb;

module.exports = class {
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
};
