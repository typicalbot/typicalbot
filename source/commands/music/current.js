const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Displays the song currently streaming.",
            usage: "current",
            aliases: ["np", "song"],
            mode: "lite",
            access: 1
        });
    }

    execute(message, parameters, permissionLevel) {
        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);

        const short = text => this.client.functions.lengthen(-1, text, 45),
            time = len => this.client.functions.convertTime(len * 1000);

        const remaining = connection.guildStream.mode === "queue" ? connection.guildStream.current.length_seconds - Math.floor(connection.guildStream.dispatcher.time / 1000) : null;

        message.send(`**__Currently Streaming:__** **${short(connection.guildStream.current.title)}**${remaining ? ` (${time(remaining)} left)` : ""} | Requested by **${connection.guildStream.current.requester.author.username}**`);
    }
};
