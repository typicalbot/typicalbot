import { MongoClient, Db, Filter, OptionalId } from 'mongodb';

class Database {
    private mongo: MongoClient | undefined;
    private db: Db | undefined;

    constructor() {
        this.initialize().catch(err => {
            console.error(err);
            process.exit(1);
        });
    }

    async initialize() {
        this.mongo = new MongoClient(process.env.MONGO_URI!);

        await this.mongo.connect();
        this.db = this.mongo.db(process.env.MONGO_DATABASE!);
    }

    public get<T>(collection: string, filter: Filter<any>) {
        return this.db?.collection<T>(collection).findOne(filter);
    }

    public insert<T>(collection: string, data: OptionalId<any>) {
        return this.db?.collection<T>(collection).insertOne(data);
    }

    public update<T>(collection: string, filter: Filter<any>, data: any) {
        return this.db?.collection<T>(collection).updateOne(filter, { $set: data });
    }

    public delete<T>(collection: string, filter: Filter<any>) {
        return this.db?.collection<T>(collection).deleteOne(filter);
    }
}

export default Database;
