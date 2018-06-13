const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(text) {
        return /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(text);
    }
}

module.exports = New;
