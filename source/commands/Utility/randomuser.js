const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "Selects a random member in the server..",
            usage: "randomuser",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const user = message.guild.members.random().user;

        response.send(`Your random pick is: **${user.username}#${user.discriminator}** (${user.id}).`);
    }
};
