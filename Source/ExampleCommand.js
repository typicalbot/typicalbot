const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "",
            description: "",
            usage: "ping",
            aliases: [],
            dm: true,
            permission: 0,
            mode: "lite"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {

    }
};
