const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "documentation",
            description: "A check to see if TypicalBot is able to respond.",
            usage: "documentation",
            aliases: ["docs"],
            dm: true,
            mode: "strict"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        response.send(`**Documentation can be found here:** <${this.client.config.urls.docs}>`);
    }
};
