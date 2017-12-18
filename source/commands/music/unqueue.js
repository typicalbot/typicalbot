const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Removes a song from the server's queue.",
            usage: "unqueue",
            mode: "lite",
            access: 1
        });
    }

    async execute(message, parameters, permissionLevel) {
        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);

        const args = /(.+)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const queue = connection.guildStream.queue;

        const query = args[1].toLowerCase();

        const search = queue.filter(v => v.title.toLowerCase() === "query");
        if (!search.length) return message.error("The given video title was not found in the queue.");
        if (search.length > 1) {
            const videos = search.map((v, i) => `**${i + 1}:** ${v.title}`).join("\n");

            message.send(`Multiple videos were found that matched your query. Select from the choices below (type \`cancel\` to cancel):\n\n${videos}`);
            const result = await this.awaitMessage(message, videos, connection.guildStream.queue);
            if (result == false) return;

            message.reply(`Removed **${result}** video${result === 1 ? "" : "s"} from the queue.`);
        } else {
            queue.splice(queue.indexOf(search[0]), 1);
            message.reply(`Removed **${search[0]}** from the queue.`);
        }
    }

    async awaitMessage(message, videos, queue) {
        const titles = videos.split("\n").map(s => /\*\*\d+:\*\*\s(.+)/.exec(s)[1]);
        message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 10000, errors: ["time"] })
            .then(async c => {
                if (c.first().content === "cancel") {
                    message.reply("Canceled").then(m => m.delete({timeout:5000}));
                    return 0;
                } else if (c.first().content === "all") {
                    titles.forEach(v => {
                        queue.splice(queue.indexOf(v), 1);
                    });
                    return titles.length;
                } else if ((/^\d+$/).test(c.first().content)) {
                    queue.splice(queue.indexOf(titles[c.first().content - 1]), 1);
                    return 1;
                } else {
                    message.error("Please provide a number, say `all`, or `cancel`.");
                    return await this.awaitMessage(message, videos);
                }
            });
    }
};
