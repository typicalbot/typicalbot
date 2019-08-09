const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Displays a list of videos queued to stream.",
            usage: "queue",
            aliases: ["q"],
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        if (!message.guild.voice) return message.send(`Noting is currently streaming.`);

        const connection = message.guild.voice.connection;

        if (!connection) return message.send(`Nothing is currently streaming.`);

        if (connection.guildStream.mode !== "queue") return message.error("This command only works while in queue mode.");

        const queue = connection.guildStream.queue;

        if (!queue.length) return message.send(`**__Queue:__** There are no videos in the queue.\n\n**__Currently Streaming:__** **${this.client.functions.lengthen(-1, connection.guildStream.current.title, 45)}** (${this.client.functions.convertTime(1000 * connection.guildStream.current.length)}) | Requested by **${connection.guildStream.current.requester.author.username}**`);

        const list = queue.slice(0, 10);

        const content = list.map(s => `● **${this.client.functions.lengthen(-1, s.title, 45)}** (${this.client.functions.convertTime(1000 * s.length)}) | Requested by **${s.requester.author.username}**`).join("\n");
        
        let length = 0; queue.forEach(s => length += Number(s.length));

        message.send(`**__Queue:__** There are **${queue.length}** videos in the queue. The queue will last for **${this.client.functions.convertTime(1000 * length)}.**\n\n${content}${queue.length > 10 ? `\n*...and ${queue.length - 10} more.*` : ""}\n\n**__Currently Streaming:__** **${this.client.functions.lengthen(-1, connection.guildStream.current.title, 45)}** (${this.client.functions.convertTime(1000 * connection.guildStream.current.length)}) | Requested by **${connection.guildStream.current.requester.author.username}**`);
    }
};
