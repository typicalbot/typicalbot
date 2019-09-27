import Cluster from '../index'
import { TaskOptions } from '../lib/types/typicalbot';

export default class Task {
    id: number;

    type: string;

    end: number;

    client: Cluster;

    constructor(client: Cluster, options: TaskOptions) {
        this.client = client;

        this.id = options.id;

        this.type = options.type;

        this.end = options.end;
    }

    // eslint-disable-next-line class-methods-use-this
    execute() {
        throw new Error(`Silly you, how did you forget to create an execute method in a task file hehehehe. Tsk Tsk Tsk!`);
    }
}
