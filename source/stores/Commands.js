const Store = require("../structures/Store");
const path = require("path");

class CommandStore extends Store {
    constructor(client) {
        super(client, "commands", path.join(__dirname, "..", "commands"));

        this.loadAll();
    }
}

module.exports = CommandStore;
