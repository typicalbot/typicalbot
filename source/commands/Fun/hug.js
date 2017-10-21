const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name, path) {
        super(client, name, path, {
            description: "'Hug' another user in the server.",
            usage: "hug [@user]"
        });
    }

    execute(message, response, permissionLevel) {
        const user = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!user || user.id === message.author.id) return response.send(`${message.author} just gave themselves a hug. :hugging: *That's not weird at all.* :eyes:`);
        response.send(`${message.author} just gave ${user} a hug. :hugging:${randomAddon ? ` Awww!` : ""}`);
    }
};
