const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "shoot",
            description: "'Shoot' another user in the server.",
            usage: "shoot [@user]"
        });
    }

    execute(message, response, permissionLevel) {
        const user = message.mentions.users.first();

        const r_addition = Math.floor(Math.random() * 9);
        const addition = r_addition === 1 ? `Someone call the police!` : r_addition === 3 ? "Wait! They missed!" : r_addition === 5 ? "Bam! Headshot!" : null;

        if (!user || user.id === message.author.id) return response.send(`${message.author} just shot at themselves! :scream:${addition ? ` ${addition}` : ""}`);
        response.send(`${message.author} just shot at ${user}! :scream:${addition ? ` ${addition}` : ""}`);
    }
};
