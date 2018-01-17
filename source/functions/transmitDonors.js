const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute() {
        const donor = this.client.guilds.get("163038706117115906").roles.find("name", "Donor");
        const list = []; donor.members.forEach(m => list.push(m.id));
        this.client.handlers.process.transmit("donors", list);
    }
}

module.exports = New;
