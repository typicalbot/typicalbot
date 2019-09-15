const { Collection } = require('discord.js');
const { join, parse } = require('path');
const klaw = require('klaw');

class FunctionHandler extends Collection {
    constructor(client) {
        super();

        Object.defineProperty(this, 'client', { value: client });

        this.load();
    }

    async load() {
        const path = join(__dirname, '..', 'functions');
        const start = Date.now();

        let count = 0;

        klaw(path).on('data', (item) => {
            const file = parse(item.path);
            if (!file.ext || file.ext !== '.js') return;

            count++;

            const req = require(join(file.dir, file.base));
            const newReq = new req(this.client, file.name, join(file.dir, file.base));

            this[file.name] = newReq;
        }).on('end', () => {
            console.log(`Loaded ${count} Functions in ${Date.now() - start}ms`);

            return this;
        });
    }
}

module.exports = FunctionHandler;
