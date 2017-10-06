class Function {
    constructor(client, name) {
        this.client = client;

        this.name = name;

        return this.execute;
    }
}

module.exports = Function;
