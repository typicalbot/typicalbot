import { Client, ClientOptions } from "discord.js";
import * as Sentry from "@sentry/node";

/**
 * @extends external:Client
 */
class TuposClient extends Client {
    /**
     * Constructs the Tupos client.
     *
     * @since 4.0.0
     * @param {ClientOptions} options
     */
    constructor(options?: ClientOptions) {
        super(options);

        // Initialize Sentry if node environment is set to production
        if (process.env.NODE_ENV === "production") {
            Sentry.init({
                dsn: process.env.SENTRY_DSN
            });
        }
    }
}

export default TuposClient;
