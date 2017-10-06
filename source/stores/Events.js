const Store = require("../structures/Store");

module.exports = class extends Store {
    constructor(client) {
        super(client, "../events");

        this.loadAll();
    }
};
