const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "ping",
            description: "A check to see if TypicalBot is able to respond.",
            usage: "ping",
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    async execute(message, response, permissionLevel) {
        let msg = await response.send("Pinging...");
        msg.edit(`Pong! | Took ${msg.createdTimestamp - message.createdTimestamp}ms`);
    }
};
