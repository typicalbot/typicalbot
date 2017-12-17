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

        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== connection.channel.id) return message.error("You must be in the same voice channel to preform that command.");

        const args = /(\d+)/i.exec(parameters);

        if (args && args[1]) connection.guildStream.queue.splice(0, args[1] - 1);

        const song = connection.guildStream.skip();

        message.reply(`Skipping **${song.title}** requested by **${song.requester.author.username}**${args ? ` and ${args[1] - 1} of the following songs.` : ""}.`);
    }
};
