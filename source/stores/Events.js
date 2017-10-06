const Store = require("../structures/Store");
const { join } = require("path");

module.exports = class extends Store {
    constructor(client) {
        super(client, join(__dirname, "..", "events"));


    }
};
