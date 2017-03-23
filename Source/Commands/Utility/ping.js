const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "A check to see if TypicalBot is able to respond.",
            usage: "ping",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        response.send("Pinging...").then(msg => {
            msg.edit(`Pong! | Took ${msg.createdTimestamp - message.createdTimestamp}ms`);
        });
    }
};
