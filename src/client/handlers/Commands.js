const { Collection } = require("discord.js");
const { join, parse } = require("path");
const klaw = require("klaw");

const pcs = require("../utility/PCS");

class CommandHandler extends Collection {
    constructor(client) {
        super();

        Object.defineProperty(this, "client", { value: client });

        this.load();
    }

    async load() {
        const path = join(__dirname, "..", "commands");
        const start = Date.now();

        klaw(path).on("data", item => {
            const file = parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const req = require((join(file.dir, file.base), file.name));
            const newReq = new req(this.client, file.name);

            this.set(file.name, newReq);
        }).on("end", () => {
            console.log(`Loaded ${this.size} Commands in ${Date.now() - start}ms`);

            return this;
        });
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

module.exports = CommandHandler;
