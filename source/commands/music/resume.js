const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Pause the song currently streaming.",
            usage: "pause",
            mode: "lite",
            access: 1
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!this.client.audioUtility.hasPermissions(message, this)) return;

        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== connection.channel.id) return message.error("You must be in the same voice channel to preform that command.");

        connection.guildStream.resume();

        message.reply(`Streaming is now resuming.`);
    }
};
