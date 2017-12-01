const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "'Stab' another user in the server.",
            usage: "stab [@user]"
        });
    }

    execute(message, parameters, permissionLevel) {
        const user = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!user || user.id === message.author.id) return message.send(`${message.author} just stabbed themselves! :dagger::scream:${randomAddon ? ` Someone call the police!` : ""}`);
        message.send(`${message.author} just stabbed ${user}! :dagger::scream:${randomAddon ? ` Someone call the police!` : ""}`);
    }
};
