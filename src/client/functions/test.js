const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    exe() {
        console.log("Aye!");
    }

    execute(error, ...args) {
        console.log(this.constructor.name);
        console.log(this);
        console.log(this.test.exe());
    }
}

module.exports = New;
