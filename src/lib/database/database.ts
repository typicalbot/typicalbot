import * as Sentry from '@sentry/node';
import { MongoClient, Db, FilterQuery } from 'mongodb';

class Database {
    private readonly mongo: MongoClient;
    private readonly db: Db;

    public constructor() {
        this.mongo = new MongoClient(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: parseInt(process.env.MONGO_POOL_SIZE!)
        });

        this.mongo.connect().catch(Sentry.captureException);

        this.db = this.mongo.db(process.env.MONGO_DATABASE!);
    }

    public get(collection: string, filter: FilterQuery<any>) {
        return this.db.collection(collection).findOne(filter);
    }

    public exists(collection: string, path: string) {
        return this.db.collection(collection).find({ [path]: { $exists: true, $ne: null } });
    }

    public insert(collection: string, data: unknown) {
        return this.db.collection(collection).insertOne(data)
            .catch(err => Sentry.captureException(err, scope => {
                scope.clear();
                scope.setTag('clusterId', process.env.CLUSTER!);
                return scope;
            }));
    }

    public update(collection: string, filter: FilterQuery<any>, data: unknown) {
        return this.db.collection(collection).updateOne(filter, { $set: data })
            .catch(err => Sentry.captureException(err, scope => {
                scope.clear();
                scope.setTag('clusterId', process.env.CLUSTER!);
                return scope;
            }));
    }

    public delete(collection: string, filter: FilterQuery<any>) {
        return this.db.collection(collection).deleteOne(filter)
            .catch(err => Sentry.captureException(err, scope => {
                scope.clear();
                scope.setTag('clusterId', process.env.CLUSTER!);
                return scope;
            }));
    }
}

export default Database;
