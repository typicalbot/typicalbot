import * as Sentry from '@sentry/node';
import {
    MongoClient,
    Db,
    FilterQuery,
    UpdateWriteOpResult,
    DeleteWriteOpResultObject,
    InsertOneWriteOpResult,
    Cursor
} from 'mongodb';

/**
 * The different collections that can be used in the database class.
 *
 * The following collections will be removed in the near future: 'guilds', 'mutes' and 'tasks'
 */
type DatabaseCollection = 'guilds' | 'mutes' | 'tasks' | 'custom_commands';

class Database {
    private readonly mongo: MongoClient;
    private readonly db: Db;

    public constructor() {
        this.mongo = new MongoClient(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: parseInt(process.env.MONGO_POOL_SIZE!)
        });

        this.mongo.connect().catch(err => Sentry.captureException(err, scope => {
            scope.clear();
            scope.setTag('clusterId', process.env.CLUSTER!);
            return scope;
        }));

        this.db = this.mongo.db(process.env.MONGO_DATABASE!);
    }

    public get(collection: DatabaseCollection, filter: FilterQuery<any>): Promise<any> {
        return this.db.collection(collection).findOne(filter);
    }

    public exists(collection: DatabaseCollection, path: string): Cursor<any> {
        return this.db.collection(collection).find({ [path]: { $exists: true, $ne: null } });
    }

    public insert(collection: DatabaseCollection, data: unknown): Promise<InsertOneWriteOpResult<any> | string> {
        return this.db.collection(collection).insertOne(data)
            .catch(err => Sentry.captureException(err, scope => {
                scope.clear();
                scope.setTag('clusterId', process.env.CLUSTER!);
                return scope;
            }));
    }

    public update(collection: DatabaseCollection, filter: FilterQuery<any>, data: unknown): Promise<UpdateWriteOpResult | string> {
        return this.db.collection(collection).updateOne(filter, { $set: data })
            .catch(err => Sentry.captureException(err, scope => {
                scope.clear();
                scope.setTag('clusterId', process.env.CLUSTER!);
                return scope;
            }));
    }

    public delete(collection: DatabaseCollection, filter: FilterQuery<any>): Promise<DeleteWriteOpResultObject | string> {
        return this.db.collection(collection).deleteOne(filter)
            .catch(err => Sentry.captureException(err, scope => {
                scope.clear();
                scope.setTag('clusterId', process.env.CLUSTER!);
                return scope;
            }));
    }
}

export default Database;
export type { DatabaseCollection };
