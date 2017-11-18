const Command = require("../../structures/Command");
const jokes = require("../../structures/jokes");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random joke.",
            usage: "joke"
        });
    }

    execute(message, permissionLevel) {
        response.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
};
