const redb = require("rethinkdbdash");
const credentials = require(`../config`).database.credentials;

const r = redb(credentials);

(async function () {
    if ((await r.dbList()).includes(credentials.db)) throw "Database Exists";
    
    await r.dbCreate(credentials.db);

    const db = r.db(credentials.db);
    
    await db.tableCreate("guilds");
    await db.tableCreate("mutes");
    await db.tableCreate("tasks");
    await db.tableCreate("donors");
    await db.tableCreate("partners");

    console.log("Database 1 Built");
    process.exit();
})();