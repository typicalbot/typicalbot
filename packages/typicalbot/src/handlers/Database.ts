import { r } from 'rethinkdb-ts';
import { Client } from 'discord.js';

export default class DatabaseHandler {
    connection = r;

    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    get(table: string, key?: string) {
        return key
            ? this.connection.table(table).get(key).run()
            : this.connection.table(table).run();
    }

    has(table: string, key: string) {
        return !!this.connection.table(table).get(key).run();
    }

    insert(table: string, data: object = {}) {
        return this.connection.table(table).insert(data).run();
    }

    update(table: string, key: string, data: object = {}) {
        return this.connection.table(table).get(key).update(data).run();
    }

    delete(table: string, key: string) {
        return this.connection.table(table).get(key).delete().run();
    }
}
