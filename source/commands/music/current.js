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
        const connection = message.guild.voiceConnection;

        if (!connection) return message.send(`Nothing is currently streaming.`);

        const remaining = connection.guildStream.mode === "queue" ? connection.guildStream.current.length - Math.floor(connection.guildStream.dispatcher.time / 1000) : null;

        message.send(`**__Currently Streaming:__** **${this.client.functions.lengthen(-1, connection.guildStream.current.title, 45)}**${remaining ? ` (${this.client.functions.convertTime(1000 * remaining)} remaining)` : ""} | Requested by **${connection.guildStream.current.requester.author.username}**`);
    }
};
