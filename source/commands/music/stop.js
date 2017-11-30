const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Stop what is currently playing.",
            usage: "stop",
            mode: "lite",
            access: 1
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!this.client.audioUtility.hasPermissions(message, this)) return;

        const currentConnection = message.guild.voiceConnection;
        if (!currentConnection) return message.send(`Nothing is currently streaming.`);

        const stream = this.client.streams.get(message.guild.id);

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== currentConnection.channel.id) return message.error("You must be in the same voice channel to preform that command.");

        stream.kill();

        message.reply(`Leaving the channel.`);
    }
};
