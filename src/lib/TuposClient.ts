import {Client} from "discord.js";
import * as Sentry from "@sentry/node";
import MongoProvider from "./providers/MongoProvider";

/**
 * @extends external:Client
 */
class TuposClient extends Client {
    public mongo: MongoProvider | undefined;

    /**
     * Constructs the Tupos client.
     *
     * @since 4.0.0
     * @param options
     */
    constructor(options?: {}) {
        super(options);

        if (process.env.NODE_ENV === "production") {
            // Initialize Sentry if node environment is set to production
            Sentry.init({
                dsn: process.env.SENTRY_DSN
            });

            // Initialize Mongoose if node environment is set to production (required)
            this.mongo = new MongoProvider(process.env.MONGODB_URL ?? null);
        }
    }
}

export default TuposClient;
