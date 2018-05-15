const Store = require("../structures/Store");
const path = require("path");

const pcs = require("../utility/PCS");

class CommandStore extends Store {
    constructor(client) {
        super(client, "commands", path.join(__dirname, "..", "commands"));

        this.loadAll();
    }

    fetch(text, settings) {
        if (this.has(text)) return this.get(text);
        if (this.find(c => c.aliases.includes(text))) return this.find(c => c.aliases.includes(text));
        if (settings && settings.pcs && settings.pcs.length && settings.pcs.map(pc => pc.command).includes(text)) return pcs(this.client, settings.pcs.filter(pc => pc.command === text)[0]);
        if (settings && settings.aliases && settings.aliases.length && settings.aliases.map(x => x.alias).includes(text)) return this.get(settings.aliases[settings.aliases.map(x => x.alias).indexOf(text)].command);
        return null;
    }

    async reload(command) {
        delete require.cache[command.path];

        const file = require(command.path);
        const req = new file(this.client, command.name, command.path);

        this.set(req.name, req);
    }
}

module.exports = CommandStore;
