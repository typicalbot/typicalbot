const redb = require("rethinkdbdash");
const credentials = require(`../config`).database.credentials;

const r = redb(credentials);

(async function () {
    if (!(await r.dbList()).includes(credentials.db)) {
        console.log(`Database \`${credentials.db}\` not found. Creating...`);
        await r.dbCreate(credentials.db);
    }
    
    const db = r.db(credentials.db);
    const dbTables = await db.tableList();
    
    if (!dbTables.includes("guilds")) {
        console.log("Table `guilds` not found. Creating...");
        await db.tableCreate("guilds");
    }
    if (!dbTables.includes("mutes")) {
        console.log("Table `mutes` not found. Creating...");
        await db.tableCreate("mutes");
    }
    if (!dbTables.includes("tasks")) {
        console.log("Table `tasks` not found. Creating...");
        await db.tableCreate("tasks");
    }
    if (!dbTables.includes("donors")) {
        console.log("Table `donors` not found. Creating...");
        await db.tableCreate("donors");
    }
    if (!dbTables.includes("partners")) {
        console.log("Table `partners` not found. Creating...");
        await db.tableCreate("partners");
    }

    console.log("The database should be good to go.");
    process.exit();
})();