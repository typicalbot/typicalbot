import Cluster from '..';
import fetch from 'node-fetch';
import * as Sentry from '@sentry/node';
import { AmplitudeEvent } from '../types/amplitude';

class AmplitudeHandler {
    private client: Cluster;
    private readonly events: AmplitudeEvent[];

    public constructor(client: Cluster) {
        this.client = client;
        this.events = [];
    }

    public getEvents() {
        return this.events;
    }

    public addEvent(event: AmplitudeEvent) {
        this.events.push(event);
    }

    public async publish(): Promise<void> {
        if (!this.client.config.apis.amplitude) return;

        await fetch('https://api.amplitude.com/2/httpapi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify({
                api_key: this.client.config.apis.amplitude,
                events: this.events.splice(0, 10).map(data => ({
                    user_id: data.userId,
                    event_type: data.eventType,
                    event_properties: data.eventProperties
                }))
            })
        }).catch(err => Sentry.captureException(err));
    }
}

export default AmplitudeHandler;
