const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(error, ...args) {
        console.log(this.constructor.name);
        console.log(this);
    }
}

module.exports = New;
