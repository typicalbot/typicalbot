import { r } from 'rethinkdb-ts';

(async () => {
    await r.connectPool({
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    });
    await r
        .branch(r.dbList().contains(process.env.DATABASE_NAME), null, r.dbCreate(process.env.DATABASE_NAME))
        .run();

    const db = r.db(process.env.DATABASE_NAME);
    const dbTables = db.tableList();

    const tables = ['guilds', 'mutes', 'tasks', 'analytics'];

    for (const table of tables) {
        await r.branch(dbTables.contains(table), null, db.tableCreate(table)).run();
    }

    console.log('The database should be good to go.');
    process.exit();
})();
