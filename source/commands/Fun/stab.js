const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "'Stab' another user in the server.",
            usage: "stab [@user]"
        });
    }

    execute(message, response, permissionLevel) {
        const user = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!user || user.id === message.author.id) return response.send(`${message.author} just stabbed themselves! :dagger::scream:${randomAddon ? ` Someone call the police!` : ""}`);
        response.send(`${message.author} just stabbed ${user}! :dagger::scream:${randomAddon ? ` Someone call the police!` : ""}`);
    }
};
