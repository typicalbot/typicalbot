import Cluster from '../client';

export default class TypicalFunction {
    client: Cluster;
    name: string;

    constructor(client: Cluster, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(..._args: unknown[]): unknown {
        throw 'Silly tsk tsk tsk. Your function does not have a execute method.';
    }
}
