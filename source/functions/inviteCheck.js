const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(text) {
        return /(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/.+/i.test(text);
    }
}

module.exports = New;
