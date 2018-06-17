const Event = require("../structures/Event");

class New extends Event {
    constructor(...args) {
        super(...args);

        this.once = true;
    }

    async execute(err) {
        console.error(err);
    }
}

module.exports = New;
