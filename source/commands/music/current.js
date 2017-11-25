const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Displays the song currently streaming.",
            usage: "current",
            mode: "lite",
            access: 1
        });
    }

    execute(message, permissionLevel) {
        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);

        const stream = this.client.streams.get(message.guild.id);

        const short = text => this.client.functions.lengthen(-1, text, 45),
            time = len => this.client.functions.convertTime(len * 1000);

        const remaining = stream.current.length_seconds - Math.floor(stream.dispatcher.time / 1000);

        message.send(`**__Currently Streaming:__** **${short(stream.current.title)}** (${time(remaining)} left) | Requested by **${stream.current.response.message.author.username}**`);
    }
};
