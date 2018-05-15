const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(text) {
        //  /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discord\.io|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i
        // /(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/.+/i
        return /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(text);
    }
}

module.exports = New;
