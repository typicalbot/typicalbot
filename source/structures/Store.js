const { Collection } = require("discord.js");
const path = require("path");
const klaw = require("klaw");

class Store extends Collection {
    constructor(client, type, dir) {
        super();

        this.client = client;

        this.type = type;

        this.dir = dir;
    }

    load(path, name) {
        const file = require(path);
        const req = new file(this.client, name);

        this.set(name, req);
    }

    async loadAll() {
        klaw(this.dir).on("data", item => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            this.load(path.join(file.dir, file.base), file.name);
        }).on("end", () => {
            return this;
        });
    }
}

module.exports = Store;
