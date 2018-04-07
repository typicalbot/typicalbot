const redb = require("rethinkdbdash");
const credentials = require(`../../config`).database.credentials;

const r = redb(credentials);

(async function () {
    if ((await r.dbList()).includes(credentials.db)) throw "Database Exists";
    
    r.dbCreate(credentials.db);

    const db = r.db(credentials.db);
    
    db.tableCreate("guilds");
    db.tableCreate("mutes");
    db.tableCreate("tasks");

    if ((await r.dbList()).includes("data")) return;

    r.dbCreate(credentials.db);

    const datadb = r.db("data");
    
    datadb.tableCreate("donors");
    datadb.tableCreate("partners");
})();