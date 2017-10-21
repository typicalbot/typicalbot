const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name, path) {
        super(client, name, path, {
            description: "'Slap' another user in the server.",
            usage: "slap [@user]"
        });
    }

    execute(message, response, permissionLevel) {
        const user = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!user || user.id === message.author.id) return response.send(`${message.author}, stop hitting yourself! :dizzy_face::wave::skin-tone-2:`);
        response.send(`${message.author} just slapped ${user}! :dizzy_face::wave::skin-tone-2:${randomAddon ? ` Oh, dang! That must've hurt!` : ""}`);
    }
};
