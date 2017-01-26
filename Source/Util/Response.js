module.exports = class Response {
    constructor(client, message) {
        this.client = client;
        this.message = message;
    }

    send(content, embed) {
        return embed ?
            this.message.channel.sendMessage(content, { embed }) :
            this.message.channel.sendMessage(content);
    }

    reply(content) {
        return this.send(`${this.message.author} | ${content}`);
    }

    error(content, embed) {
        return this.send(`${this.message.author} | \`❌\` | ${content}`, embed);
    }

    usage(command) {
        return this.error(`Invalid command usage. Check \`${this.client.config.prefix}help ${command}\` for more information.`);
    }

    dm(content, embed) {
        return embed ?
            this.message.author.sendMessage(content, { embed }) :
            this.message.author.sendMessage(content);
    }
};
