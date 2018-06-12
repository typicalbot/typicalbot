const { Collection } = require("discord.js");
const { join, parse } = require("path");
const klaw = require("klaw");

class EventHandler extends Collection {
    constructor(client) {
        super();

        Object.defineProperty(this, "client", { value: client });

        this.load().then(() => this.forEach(e => client[e.once ? "once" : "on"](e.name, (...args) => e.execute(...args))));
    }

    async load() {
        const path = join(__dirname, "..", "events");
        const start = Date.now();

        klaw(path).on("data", item => {
            const file = parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const req = require(join(file.dir, file.base));
            const newReq = new req(this.client, file.name);

            this.set(file.name, newReq);
        }).on("end", () => {
            console.log(`Loaded ${this.size} Events in ${Date.now() - start}ms`);

            return this;
        });
    }

    reload() {
        this.forEach(e => delete require.cache[e.path]);
    }
}

module.exports = EventHandler;