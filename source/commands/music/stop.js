const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Stop what is currently playing.",
            usage: "stop",
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!this.client.audioUtility.hasPermissions(message, this)) return;

        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);
        if (!connection.guildStream) {
            connection.disconnect();
            return message.error("An error occured while trying to complete this action, and requires me to leave the voice channel. Sorry!");
        }

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== connection.channel.id) return message.error("You must be in the same voice channel to preform that command.");

        connection.guildStream.end();

        message.reply("Stopping all streaming audio.");
    }
};
