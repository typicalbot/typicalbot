const Store = require("../structures/Store");

class EventStore extends Store {
    constructor(client) {
        super(client, "events", "../events");

        this.loadAll().then(events => {
            events.forEach(e => {
                client.on(e.event, (...args) => e.execute(...args));
            });
        });
    }
}

module.exports = EventStore;
