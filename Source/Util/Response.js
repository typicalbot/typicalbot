module.exports = class Response {
    constructor(message) {
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

    dm(content, embed) {
        return embed ?
            this.message.author.sendMessage(content, { embed }) :
            this.message.author.sendMessage(content);
    }
};
