const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Skip what is currently playing.",
            usage: "skip [amount]",
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters, permissionLevel) {
        if (!await this.client.utility.music.hasPermissions(message, this)) return;

        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);
        if (!connection.guildStream) {
            connection.disconnect();
            return message.error("An error occured while trying to complete this action, and requires me to leave the voice channel. Sorry!");
        }

        if (!message.member.voiceChannel || message.member.voiceChannel.id !== connection.channel.id) return message.error("You must be in the same voice channel to preform that command.");

        if (connection.guildStream.mode !== "queue") return message.error("This command only works while in queue mode.");
        
        const args = /(\d+)/i.exec(parameters);

        if (args && args[1]) connection.guildStream.queue.splice(0, args[1] - 1);

        const song = connection.guildStream.skip();

        message.reply(`Skipping **${song.title}** requested by **${song.requester.author.username}**${args ? ` and ${args[1] - 1} of the following songs` : ""}.`);
    }
};
