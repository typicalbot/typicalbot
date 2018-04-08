const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "'Hug' another user in the server.",
            usage: "hug [@user]"
        });
    }

    execute(message, parameters, permissionLevel) {
        const mention = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!mention || mention.id === message.author.id) return message.send(`${message.author} just gave themselves a hug. :hugging: *That's not weird at all.* :eyes:`);

        message.send(`${message.author} just gave ${mention} a hug. :hugging:${randomAddon ? ` Awww!` : ""}`);
    }
};
