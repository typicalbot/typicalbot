const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "current",
            description: "Displays the song currently streaming.",
            usage: "current",
            mode: "lite"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let connection = message.guild.voiceConnection;
        if (!connection) return response.send(`Nothing is currently streaming.`);

        let stream = this.client.streams.get(message.guild.id);

        let short = text => this.client.functions.shorten(text),
            time = len => this.client.functions.length(len);

        let remaining = stream.current.length_seconds - Math.floor(stream.dispatcher.time / 1000);

        response.send(`**__Currently Streaming:__** **${short(stream.current.title)}** (${time(remaining)} left) | Requested by **${stream.current.response.message.author.username}**`);
    }
};
