class Function {
    constructor(client, name) {
        Object.defineProperty(this, 'client', { value: client });

        this.name = name;

        return this.execute;
    }
}

module.exports = Function;
