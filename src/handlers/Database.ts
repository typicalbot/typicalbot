import { r, MasterPool } from 'rethinkdb-ts';
import Cluster from '..';

export default class DatabaseHandler {
    connection = r;
    client: Cluster;
    pool: MasterPool | null = null;

    constructor(client: Cluster) {
        this.client = client;

        this.init();
    }

    async init() {
        this.pool = await r.connectPool(
            this.client.config.database.credentials
        );
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
            .update(data, { returnChanges: true })
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
