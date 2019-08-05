class Event {
    constructor(client, name, path) {
        Object.defineProperty(this, "client", { value: client });

        this.name = name;
    }
}

module.exports = Event;
