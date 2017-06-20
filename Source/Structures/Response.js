class Response {
    constructor(client, message) {
        this.client = client;
        this.message = message;
    }

    send(content, embed) {
        return embed ?
            this.message.channel.send(content, { embed }) :
            this.message.channel.send(content);
    }

    reply(content, embed) {
        return this.send(`${this.message.author} | ${content}`, embed);
    }

    embed(embed) {
        return this.send("", embed);
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

    perms(command, uLevel) {
        let rLevel = this.client.permissionsManager.define(command.permission);
        return this.error(`Your permission level is too low to execute that command. The command requires permission level ${rLevel.level} (${rLevel.title}) and you are level ${uLevel.level} (${uLevel.title}).`);
    }

    elevation(command, uLevel, rLevel) {
        rLevel = this.client.permissionsManager.define(rLevel);
        return this.error(`This server requires elevated permissions to use that command. The command requires permission level ${rLevel.level} (${rLevel.title}) and you are level ${uLevel.level} (${uLevel.title}).`);
    }

    dm(content, embed) {
        return embed ?
            this.message.author.send(content, { embed }) :
            this.message.author.send(content);
    }
}

module.exports = Response;
