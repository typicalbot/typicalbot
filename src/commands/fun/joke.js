const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random joke.",
            usage: "joke"
        });
    }

    execute(message) {
        fetch("https://icanhazdadjoke.com/", { headers: { 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(json => message.send(json.joke))
            .catch(message.error("An error occurred making that request."));
    }
};
