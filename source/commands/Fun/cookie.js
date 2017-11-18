const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Give another user a cookie or keep them all for yourself.",
            usage: "cookie [@user]"
        });
    }

    execute(message, permissionLevel) {
        const user = message.mentions.users.first();

        const randomAddon = Math.random() <= 0.25;

        if (!user || user.id === message.author.id) return response.send(`${message.author} ${randomAddon ? "laughed like a madman while slowly eating the cookies they kept for themself in front of everyone." : "decided to keep all of the cookies for themself! What a jerk! :angry:"}`);
        response.send(`${message.author} just gave ${user} a cookie. :cookie:`);
    }
};
