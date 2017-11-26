const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Makes the bot send a message with the content used.",
            usage: "say [#channel] <content>",
            aliases: ["speak"],
            mode: "strict",
            permission: 2
        });
    }

    execute(message, parameters, permissionLevel) {
        const args = /(?:<#)?(\d+)>?\s+((?:.|[\r\n])+)?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const channel = message.guild.channels.get(args[1]);
        const content = args[2];

        channel ?
            channel.send(content).catch(err => message.error("I am missing the SEND_MESSAGES permission in the channel requested.")) :
            message.send(content);

        if (message.deletable) message.delete({ timeout: 500 });
    }
};
