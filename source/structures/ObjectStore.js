const path = require("path");
const klaw = require("klaw");

class Store extends Object {
    constructor(client, type, dir) {
        super();

        this.client = client;

        this.type = type;

        this.dir = dir;
    }

    load(path, name) {
        const file = require(path);
        const req = new file(this.client, name);

        this[name] = req;
    }

    loadAll() {
        return new Promise((resolve, reject) => {
            const start = Date.now();

            klaw(this.dir).on("data", item => {
                const file = path.parse(item.path);
                if (!file.ext || file.ext !== ".js") return;

                this.load(path.join(file.dir, file.base), file.name);
            }).on("end", () => {
                console.log(`Loaded ${Object.keys(this).length} ${this.type} in ${Date.now() - start}ms`);

                return resolve();
            });
        });
    }
}

module.exports = Store;
