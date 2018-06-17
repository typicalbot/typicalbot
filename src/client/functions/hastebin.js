const Function = require("../structures/Function");
const snekfetch = require("snekfetch");

class Hastebin extends Function {
    constructor(client, name) {
        super(client, name);
    }

    async execute(content) {
        const { body } = await snekfetch.post("https://hastebin.com/documents").send(content).catch(e => { throw e; });

        return `https://hastebin.com/${body.key}`;
    }
}

module.exports = Hastebin;
