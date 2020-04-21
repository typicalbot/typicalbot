import Cluster from '../client';

export default class Event {
    client: Cluster;
    name: string;
    once = false;

    constructor(client: Cluster, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(..._args: unknown[]) {
        throw 'So Silly of you. How can you make an event and never have an execute function.';
    }
}
