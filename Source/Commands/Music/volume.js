const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "volume",
            description: "Change the volume of the song currently streaming.",
            usage: "volume <percent:0-200>",
            mode: "lite"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        if (!this.client.audioUtility.hasPermissions(response, this)) return;

        const currentConnection = message.guild.voiceConnection;
        if (!currentConnection) return response.send(`Nothing is currently streaming.`);

        const stream = this.client.streams.get(message.guild.id);

        const match = /volume\s+(\d+)/i.exec(message.content);
        if (!match) return response.reply(`The audio streaming is at ${stream.dispatcher.volume * 100}% volume.`);

        const volume = match[1];
        if (volume < 0 || volume > 200) return response.error(`Invalid command usage. Volume must be a percent from 0% to 200%.`);

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== currentConnection.channel.id) return response.error("You must be in the same voice channel to preform that command.");

        stream.setVolume(volume * 0.01);

        response.reply(`Changed the volume to **${volume}%**.`);
    }
};
