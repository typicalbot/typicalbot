const path = require("path");
const klaw = require("klaw");

class Store {
    constructor(client, type, dir) {
        this.client = client;

        this.type = type;

        this.dir = dir;

        this.store = new Object();
    }

    load(path, name) {
        const file = require(path);
        const req = new file(this.client, name);

        this.store[name] = req;
    }

    loadAll() {
        return new Promise((resolve, reject) => {
            const start = Date.now();

            klaw(this.dir).on("data", item => {
                const file = path.parse(item.path);
                if (!file.ext || file.ext !== ".js") return;

                this.load(path.join(file.dir, file.base), file.name);
            }).on("end", () => {
                console.log(`Loaded ${Object.keys(this.store).length} ${this.type} in ${Date.now() - start}ms`);
                this.applyToClass(this.store, this);

                return resolve();
            });
        });
    }

    applyToClass(base, structure, skips = []) {
        for (const method of Object.getOwnPropertyNames(base.prototype)) {
            if (!skips.includes(method)) Object.defineProperty(structure.prototype, method, Object.getOwnPropertyDescriptor(base.prototype, method));
        }
    }
}

module.exports = Store;
