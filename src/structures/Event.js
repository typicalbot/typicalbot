class Event {
    constructor(client, name) {
        Object.defineProperty(this, 'client', { value: client });

        this.name = name;
    }
}

module.exports = Event;
