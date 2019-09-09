const Command = require("../../structures/Command");
const jokes = require("../../utility/jokes");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Gives you a random joke.",
            usage: "joke"
        });
    }

    execute(message) {
        message.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
};
