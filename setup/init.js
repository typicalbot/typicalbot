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

    console.log("Database 1 Built");

    if ((await r.dbList()).includes("data")) process.exit();

    await r.dbCreate("data");

    const datadb = r.db("data");
    
    await datadb.tableCreate("donors");
    await datadb.tableCreate("partners");

    console.log("Database 2 Built");
    process.exit();
})();