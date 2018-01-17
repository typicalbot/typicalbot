const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "'Slap' another user in the server.",
            usage: "slap [@user]"
        });
    }

    execute(message, parameters, permissionLevel) {
        const mention = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!mention || mention.id === message.author.id) return message.send(`${message.author}, stop hitting yourself! :dizzy_face::wave::skin-tone-2:`);
       
        message.send(`${message.author} just slapped ${mention}! :dizzy_face::wave::skin-tone-2:${randomAddon ? ` Oh, dang! That must've hurt!` : ""}`);
    }
};
