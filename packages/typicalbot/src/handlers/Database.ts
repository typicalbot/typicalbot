import { r, MasterPool } from 'rethinkdb-ts';
import { Client } from 'discord.js';
import * as config from '../../../../config.json';

export default class DatabaseHandler {
    connection = r;
    client: Client;
    pool: MasterPool | null = null;

    constructor(client: Client) {
        this.client = client;

        this.init();
    }

    async init() {
        console.log('db init');
        this.pool = await r.connectPool(config.database.credentials);
        console.log('after db init');
    }

    get(table: string, key?: string) {
        return key
            ? this.connection
                  .table(table)
                  .get(key)
                  .run()
            : this.connection.table(table).run();
    }

    has(table: string, key: string) {
        return !!this.connection
            .table(table)
            .get(key)
            .run();
    }

    insert(table: string, data: object = {}) {
        return this.connection
            .table(table)
            .insert(data)
            .run();
    }

    update(table: string, key: string, data: object = {}) {
        return this.connection
            .table(table)
            .get(key)
            .update(data)
            .run();
    }

    delete(table: string, key: string) {
        return this.connection
            .table(table)
            .get(key)
            .delete()
            .run();
    }
}
