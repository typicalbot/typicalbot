class Triggers {
    constructor(client) {
        this.client = client;

        this.connection = client.settings.connection;

        this.triggers = new Map();
    }
}
