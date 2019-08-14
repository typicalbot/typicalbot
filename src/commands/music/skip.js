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

        try {
            const connection = message.guild.voice.connection;

            if (!connection) return message.send(`Nothing is currently streaming.`);
            if (!message.member.voice.channel || message.member.voice.channel.id !== connection.channel.id) return message.error("You must be in the same voice channel to perform that command.");
            if (connection.guildStream.mode !== "queue") return message.error("This command only works while in queue mode.");

            const args = /(\d+)/i.exec(parameters);

            if (args && args[1]) connection.guildStream.queue.splice(0, args[1] - 1);

            const song = connection.guildStream.skip();

            if (!song) return message.reply("Skipping.");

            message.reply(`Skipping **${song.title}** requested by **${song.requester.author.username}**${args ? ` and ${args[1] - 1} of the following songs` : ""}.`);
        } catch (e) {
            message.send(`Nothing is currently streaming.`);
        }
    }
};
