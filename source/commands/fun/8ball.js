const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Ask the magic 8ball a question.",
            usage: "8ball <question>"
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!message.content.split(" ")[1]) return message.error(`I can't respond to a non-existant question!`);

        const responses = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook is good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
        message.reply(responses[Math.floor(Math.random() * responses.length)]);
    }
};
