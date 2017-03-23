class Response {
    constructor(client, message) {
        this.client = client;
        this.message = message;
    }

    send(content, embed) {
        return embed ?
            this.message.channel.sendMessage(content, { embed }) :
            this.message.channel.sendMessage(content);
    }

    reply(content, embed) {
        return this.send(`${this.message.author} | ${content}`, embed);
    }

    error(content, embed) {
        return this.send(`${this.message.author} | \`❌\` | ${content}`, embed);
    }

    success(content, embed) {
        return this.send(`${this.message.author} | \`✔\` | ${content}`, embed);
    }

    usage(command) {
        return this.error(`Invalid command usage. Check \`${this.client.config.prefix}help ${command.name}\` for more information.`);
    }

    perms(rLevel, uLevel) {
        let rLevelText = this.client.functions.numberToLevel(rLevel);
        let uLevelText = this.client.functions.numberToLevel(uLevel);

        return this.error(`Your permission level is too low to execute that command. The command requires permission level ${rLevel} (${rLevelText}) and you are level ${uLevel} (${uLevelText}).`);
    }

    dm(content, embed) {
        return embed ?
            this.message.author.sendMessage(content, { embed }) :
            this.message.author.sendMessage(content);
    }
}

module.exports = Response;
