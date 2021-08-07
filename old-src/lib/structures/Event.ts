import TypicalClient from '../TypicalClient';

export default class Event {
    client: TypicalClient;
    name: string;
    once = false;

    constructor(client: TypicalClient, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(..._args: unknown[]) {
        throw new Error('Unsupported operation.');
    }
}
