const Function = require("../structures/Function");
const snekfetch = require("snekfetch");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    async execute(content) {
        const { body } = await snekfetch.get("https://hastebin.com/documents").send(content).catch(e => { throw e; });

        return `https://hastebin.com/${body.key}`;
    }
}

module.exports = New;
