const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Change the volume of the song currently streaming.",
            usage: "volume <percent:0-200>",
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!this.client.utility.music.hasPermissions(message, this)) return;

        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);
        if (!connection.guildStream) {
            connection.disconnect();
            return message.error("An error occured while trying to complete this action, and requires me to leave the voice channel. Sorry!");
        }

        const match = /(\d+)/i.exec(message.content);
        if (!match) {
            const x = Math.round(connection.dispatcher.volume * 10);
            return message.reply(`Volume: ${"▰".repeat(x > 10 ? (x/2) : x) + "▱".repeat(x > 10 ? 10 - (x/2) : 10 - x)} ${Math.round(connection.guildStream.dispatcher.volume * 100)}%`);
        }

        const volume = match[1];
        if (volume < 0 || volume > 200) return message.error(`Invalid command usage. Volume must be a percent from 0% to 200%.`);

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== connection.channel.id) return message.error("You must be in the same voice channel to preform that command.");

        connection.guildStream.setVolume(volume * 0.01);

        const x = Math.round(connection.dispatcher.volume * 10);
        message.reply(`Volume: ${"▰".repeat(x > 10 ? (x/2) : x) + "▱".repeat(x > 10 ? 10 - (x/2) : 10 - x)} ${Math.round(connection.guildStream.dispatcher.volume * 100)}%`);
    }
};
