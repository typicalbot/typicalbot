const Command = require("../../structures/Command");
const jokes = require("../../structures/jokes");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "joke",
            description: "Gives you a random joke.",
            usage: "joke"
        });
    }

    execute(message, response, permissionLevel) {
        response.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
};
