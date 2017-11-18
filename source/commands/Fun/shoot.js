const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "'Shoot' another user in the server.",
            usage: "shoot [@user]"
        });
    }

    execute(message, permissionLevel) {
        const user = message.mentions.users.first();

        const randomAddonNum = Math.random();
        const randomAddon = randomAddonNum <= 0.1 ? " Someone call the police!" :
            randomAddonNum <= 0.2 && randomAddonNum > 0.1 ? " Wait! They missed!" :
                randomAddonNum <= 0.3 && randomAddonNum > 0.2 ? " Bam! Headshot!" : null;

        if (!user || user.id === message.author.id) return response.send(`${message.author} just shot at themselves! :scream:${randomAddon || ""}`);
        response.send(`${message.author} just shot at ${user}! :scream:${randomAddon || ""}`);
    }
};
