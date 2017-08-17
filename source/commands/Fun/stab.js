const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "stab",
            description: "'Stab' another user in the server.",
            usage: "stab [@user]"
        });
    }

    execute(message, response, permissionLevel) {
        const user = message.mentions.users.first();

        const r_addition = Math.floor(Math.random() * 4);
        const addition = r_addition === 1 ? `Someone call the police!` : null;

        if (!user || user.id === message.author.id) return response.send(`${message.author} just stabbed themselves! :dagger::scream:${addition ? ` ${addition}` : ""}`);
        response.send(`${message.author} just stabbed ${user}! :dagger::scream:${addition ? ` ${addition}` : ""}`);
    }
};
