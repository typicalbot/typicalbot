import { join, parse } from 'path';
import * as Sentry from '@sentry/node';
import { Collection } from 'discord.js';
import klaw from 'klaw';
import Cluster from '../lib/TypicalClient';
import Event from '../lib/structures/Event';

export default class EventHandler extends Collection<string, Event> {
    client: Cluster;

    constructor(client: Cluster) {
        super();

        this.client = client;

        this.init().catch((err) => Sentry.captureException(err));
    }

    async init() {
        const path = join(__dirname, '..', 'events');
        const start = Date.now();

        klaw(path)
            .on('data', (item) => {
                const file = parse(item.path);

                if (file.ext && file.ext === '.js') {
                    const Event = ((r) => r.default || r)(require(join(file.dir, file.base)));
                    const event: Event = new Event(this.client, file.name, join(file.dir, file.base));

                    this.set(file.name, event);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    this.client[event.once ? 'once' : 'on'](event.name, (...args: unknown[]) => event.execute(...args));
                }
            })
            .on('end', () => {
                this.client.logger.info(`Loaded ${this.size} Events in ${Date.now() - start}ms`);
            });
    }
}
