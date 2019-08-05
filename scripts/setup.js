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

    const tables = ["guilds", "mutes", "tasks", "donors"];

    for (const t of tables) {
        if (!dbTables.includes(t)) {
            console.log(`Table ${t} not found. Creating...`);
            await db.tableCreate(t);
        }
    }

    console.log("The database should be good to go.");
    process.exit();
})();