import { join, parse } from 'path';
import * as Sentry from '@sentry/node';
import { Collection } from 'discord.js';
import klaw from 'klaw';
import Cluster from '../lib/TypicalClient';
import TypicalFunction from '../lib/structures/Function';

export default class FunctionHandler extends Collection<string, TypicalFunction> {
    client: Cluster;

    constructor(client: Cluster) {
        super();
        this.client = client;

        this.init().catch((err) => Sentry.captureException(err));
    }

    async init() {
        const path = join(__dirname, '..', 'functions');
        const start = Date.now();

        let count = 0;

        klaw(path)
            .on('data', (item) => {
                const file = parse(item.path);
                if (!file.ext || file.ext !== '.js') return;

                count++;

                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const Function = ((r) => r.default || r)(require(join(file.dir, file.base)));
                const newReq = new Function(this.client, file.name);

                this.set(file.name, newReq);

                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                this.client.helpers[file.name] = newReq;
            })
            .on('end', () => {
                this.client.logger.info(`Loaded ${count} Functions in ${Date.now() - start}ms`);

                return this;
            });
    }
}
