const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "say",
            description: "Makes the bot send a message with the content used.",
            usage: "say [#channel] <content>",
            aliases: ["speak"],
            mode: "strict",
            permission: 2
        });
    }

    execute(message, response, permissionLevel) {
        const args = /(?:say|speak)(?:\s+(?:<#)?(\d+)>?)?\s+((?:.|[\r\n])+)?/i.exec(message.content);
        if (!args) return response.usage(this);

        const channel = message.guild.channels.get(args[1]);
        const content = args[2];

        channel ?
            channel.send(content).catch(err => response.error("I am missing the SEND_MESSAGES permission in the channel requested.")) :
            response.send(content);

        if (message.deletable) message.delete({ timeout: 500 });
    }
};
