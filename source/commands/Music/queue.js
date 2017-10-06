const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "Displays a list of videos queued to stream.",
            usage: "queue",
            mode: "lite"
        });
    }

    execute(message, response, permissionLevel) {
        const connection = message.guild.voiceConnection;
        if (!connection) return response.send(`Nothing is currently streaming.`);

        const stream = this.client.streams.get(message.guild.id);
        const queue = stream.queue;

        const short = text => this.client.functions.lengthen.execute(-1, text, 45),
            time = len => this.client.functions.convertTime.execute(len * 1000);

        if (!queue.length) return  response.send(`**__Queue:__** There are no videos in the queue.\n\n**__Currently Streaming:__** **${short(stream.current.title)}** (${time(stream.current.length_seconds)}) | Requested by **${stream.current.response.message.author.username}**`);

        const list = queue.slice(0, 10);

        const content = list.map(s => `● **${short(s.title)}** (${time(s.length_seconds)}) | Requested by **${s.response.message.author.username}**`).join("\n");
        let length = 0; queue.forEach(s => length += Number(s.length_seconds));

        response.send(`**__Queue:__** There are **${queue.length}** videos in the queue. The queue will last for **${time(length)}.**\n\n${content}${queue.length > 10 ? `\n*...and ${queue.length - 10} more.*` : ""}\n\n**__Currently Streaming:__** **${short(stream.current.title)}** (${time(stream.current.length_seconds)}) | Requested by **${stream.current.response.message.author.username}**`);
    }
};
