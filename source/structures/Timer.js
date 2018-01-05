const { Collection } = require("discord.js");

class Timer extends Collection {
    constructor(client, name, path) {
        super();
        
        Object.defineProperty(this, "client", { value: client });

        this.name = name;

        this.path = path;
    }
}

module.exports = Timer;
