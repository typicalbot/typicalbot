import * as Sentry from '@sentry/node';
import Cluster from '../lib/TypicalClient';
import { MongoClient, Db } from 'mongodb';

export default class DatabaseHandler {
    client: Cluster;

    mongo: MongoClient | null = null;
    db: Db | null = null;

    constructor(client: Cluster) {
        this.client = client;

        this.init().catch((err) => Sentry.captureException(err));
    }

    async init() {
        this.mongo = new MongoClient(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await this.mongo.connect();

        this.db = this.mongo.db(process.env.MONGO_DATABASE!);
    }

    get(table: string, key?: Record<string, unknown>) {
        return key
            ? this.db
                ?.collection(table)
                .findOne(key)
            : this.db
                ?.collection(table);
    }

    has(table: string, key: Record<string, unknown>) {
        return !!this.db
            ?.collection(table)
            .findOne(key);
    }

    insert(table: string, data: Record<string, unknown> = {}) {
        return this.db
            ?.collection(table)
            .insertOne(data);
    }

    update(table: string, key: Record<string, unknown>, data: Record<string, unknown> = {}) {
        return this.db
            ?.collection(table)
            .updateOne(key, { $set: data });
    }

    delete(table: string, key: Record<string, unknown>) {
        return this.db
            ?.collection(table)
            .deleteOne(key);
    }
}
