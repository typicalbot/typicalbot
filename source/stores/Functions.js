const Store = require("../structures/Store");
const path = require("path");

class FunctionStore extends Store {
    constructor(client) {
        super(client, "functions", path.join(__dirname, "..", "functions"));

        this.loadAll();
    }
}

module.exports = FunctionStore;
