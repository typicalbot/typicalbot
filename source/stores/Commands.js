const Store = require("../structures/Store");
const path = require("path");

class CommandStore extends Store {
    constructor(client) {
        super(client, "commands", path.join(__dirname, "..", "commands"));

        this.loadAll();
    }

    async get(text) {
        if (this.has(text)) return super.get(text);
        if (this.has(c => c.aliases.includes(text))) return super.get(c => c.aliases.includes(text));
        return null;
    }
}

module.exports = CommandStore;
