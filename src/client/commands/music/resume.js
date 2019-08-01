const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Resume the song paused.",
            usage: "resume",
            aliases: ["unpause"],
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters, permissionLevel) {
        if (!await this.client.utility.music.hasPermissions(message, this)) return;

        const connection = message.guild.voice.connection;

        if (!connection) return message.send(`Nothing is currently streaming.`);

        if (!message.member.voice.channel || message.member.voice.channel.id !== connection.channel.id) return message.error("You must be in the same voice channel to perform that command.");

        if (connection.guildStream.mode !== "queue") return message.error("This command only works while in queue mode.");

        connection.guildStream.resume();

        message.reply(`Streaming is now resuming.`);
    }
};
