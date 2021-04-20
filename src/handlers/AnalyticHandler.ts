import * as Sentry from '@sentry/node';
import Cluster from '../lib/TypicalClient';
import { AnalyticEvent } from '../lib/types/analytic';

class AnalyticHandler {
    private readonly client: Cluster;
    private readonly events: AnalyticEvent[];

    public constructor(client: Cluster) {
        this.client = client;
        this.events = [];
    }

    public getEvents() {
        return this.events;
    }

    public addEvent(event: AnalyticEvent) {
        this.events.push(event);
    }

    public async publish(): Promise<void> {
        //const event = this.events.shift();

        //await this.client.handlers.database.insert('analytics', event).catch((err) => Sentry.captureException(err));
    }
}

export default AnalyticHandler;
