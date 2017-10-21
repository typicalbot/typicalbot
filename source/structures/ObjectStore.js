const path = require("path");
const klaw = require("klaw");

class Store {
    constructor(client, type, dir) {
        this.client = client;

        this.type = type;

        this.dir = dir;

        this.c = 0;
    }

    load(path, name) {
        const file = require(path);
        const req = new file(this.client, name, path);

        this[name] = req;
    }

    loadAll() {
        return new Promise((resolve, reject) => {
            const start = Date.now();

            klaw(this.dir).on("data", item => {
                const file = path.parse(item.path);
                if (!file.ext || file.ext !== ".js") return;

                this.c++;

                this.load(path.join(file.dir, file.base), file.name);
            }).on("end", () => {
                console.log(`Loaded ${this.c} ${this.type} in ${Date.now() - start}ms`);

                return resolve();
            });
        });
    }
}

module.exports = Store;
