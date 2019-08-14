const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Displays the song currently streaming.",
            usage: "current",
            aliases: ["np", "song"],
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        try {
            const connection = message.guild.voice.connection;
            if (!connection) return message.send("Nothing is currently streaming.");

            const remaining = connection.guildStream.mode === "queue" ? ((message.guild.voice.connection.guildStream.current.length * 1000) - message.guild.voice.connection.guildStream.dispatcher.streamTime) : null;

            message.send(`**__Currently Streaming:__** **${this.client.functions.lengthen(-1, connection.guildStream.current.title, 45)}**${remaining ? ` (${this.client.functions.convertTime(remaining)} remaining)` : ""} | Requested by **${connection.guildStream.current.requester.author.username}**`);
        } catch (e) {
            message.send("Nothing is currently streaming.")
        }
    }
};
