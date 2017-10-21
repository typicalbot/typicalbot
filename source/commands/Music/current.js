const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name, path) {
        super(client, name, path, {
            description: "Displays the song currently streaming.",
            usage: "current",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const connection = message.guild.voiceConnection;
        if (!connection) return response.send(`Nothing is currently streaming.`);

        const stream = this.client.streams.get(message.guild.id);

        const short = text => this.client.functions.lengthen(-1, text, 45),
            time = len => this.client.functions.convertTime(len * 1000);

        const remaining = stream.current.length_seconds - Math.floor(stream.dispatcher.time / 1000);

        response.send(`**__Currently Streaming:__** **${short(stream.current.title)}** (${time(remaining)} left) | Requested by **${stream.current.response.message.author.username}**`);
    }
};
