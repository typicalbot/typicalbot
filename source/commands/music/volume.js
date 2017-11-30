const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Change the volume of the song currently streaming.",
            usage: "volume <percent:0-200>",
            mode: "lite",
            access: 1
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!this.client.audioUtility.hasPermissions(message, this)) return;

        const currentConnection = message.guild.voiceConnection;
        if (!currentConnection) return message.send(`Nothing is currently streaming.`);

        const stream = this.client.streams.get(message.guild.id);

        const match = /(\d+)/i.exec(message.content);
        if (!match) return message.reply(`The audio streaming is at ${stream.dispatcher.volume * 100}% volume.`);

        const volume = match[1];
        if (volume < 0 || volume > 200) return message.error(`Invalid command usage. Volume must be a percent from 0% to 200%.`);

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== currentConnection.channel.id) return message.error("You must be in the same voice channel to preform that command.");

        stream.setVolume(volume * 0.01);

        message.reply(`Changed the volume to **${volume}%**.`);
    }
};
