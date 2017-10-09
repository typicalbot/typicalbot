const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute() {
        const tester = this.client.guilds.get("163038706117115906").roles.find("name", "Beta Tester");
        const list = []; tester.members.forEach(m => list.push(m.id));
        this.client.transmit("testers", list);
    }
}

module.exports = New;
