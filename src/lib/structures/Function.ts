import TypicalClient from '../TypicalClient';

export default class TypicalFunction {
    client: TypicalClient;
    name: string;

    constructor(client: TypicalClient, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(..._args: unknown[]): unknown {
        throw new Error('Unsupported operation.');
    }
}
