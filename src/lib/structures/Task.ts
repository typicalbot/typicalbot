import TypicalClient from '../TypicalClient';
import { TaskOptions } from '../types/typicalbot';

export default class Task {
    id: number;
    type: string;
    end: number;
    data: unknown;
    client: TypicalClient;

    constructor(client: TypicalClient, options: TaskOptions) {
        this.client = client;
        this.id = options.id;
        this.type = options.type;
        this.end = options.end;
        this.data = options.data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(_data?: unknown): Promise<void> {
        throw new Error('Unsupported operation.');
    }
}
