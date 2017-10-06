const Store = require("../structures/Store");
const path = require("path");

class EventStore extends Store {
    constructor(client) {
        super(client, "events", path.join(__dirname, "..", "events"));

        this.loadAll().then(() => {
            this.filter(e => !e.once).forEach(e => {
                client.on(e.name, (...args) => e.execute(...args));
            });
            this.filter(e => e.once).forEach(e => {
                client.once(e.name, (...args) => e.execute(...args));
            });
        });
    }
}

module.exports = EventStore;
