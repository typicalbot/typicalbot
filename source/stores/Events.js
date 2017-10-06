const Store = require("../structures/Store");
const path = require("path");

class EventStore extends Store {
    constructor(client) {
        super(client, "events", path.join(__dirname, "..", "events"));

        this.loadAll().then(() => {
            this.forEach(e => {
                client.on(e.name, (...args) => e.execute(...args));
            });
        });
    }
}

module.exports = EventStore;
