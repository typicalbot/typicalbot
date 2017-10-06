const { Collection } = require("discord.js");
const path = require("path");
const klaw = require("klaw");

class Store extends Collection {
    constructor(client, dir) {
        super();

        this.client = client;
        this.dir = dir;
    }

    load(path, name) {
        const file = require(path);
        const req = new file(this.client);

        this.set(name, req);
    }

    loadAll() {
        klaw(this.dir).on("data", item => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            this.load(path.join(file.dir, file.base), file.name);
        });
    }
}
