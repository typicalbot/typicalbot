const Event = require('../structures/Event');

class Error extends Event {
    constructor(...args) {
        super(...args);

        this.once = true;
    }

    async execute(err) {
        console.error(err);
    }
}

module.exports = Error;
