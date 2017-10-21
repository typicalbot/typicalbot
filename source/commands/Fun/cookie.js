const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Give another user a cookie or keep them all for yourself.",
            usage: "cookie [@user]"
        });
    }

    execute(message, response, permissionLevel) {
        const user = message.mentions.users.first();

        if (!user || user.id === message.author.id) return response.send(`${message.author} decided to keep all of the cookies for themself! What a jerk! :angry:`);
        response.send(`${message.author} just gave ${user} a cookie. :cookie:`);
    }
};
