import mongoose, {Connection} from "mongoose";

class MongoProvider {
    private readonly _connection: Connection;

    /**
     * Constructs the MongoDB provider.
     *
     * @since 4.0.0
     * @param url
     */
    constructor(url: string | null) {
        if (url === null) {
            throw new Error('MongoDB url cannot be null.');
        }

        mongoose.connect(url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).catch(err => console.error(err));

        this._connection = mongoose.connection;
    }

    /**
     * Get MongoDB connection.
     *
     * @return Connection
     */
    get connection(): Connection {
        return this._connection;
    }
}

export default MongoProvider;
