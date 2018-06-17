const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Removes a song from the server's queue.",
            usage: "unqueue",
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters, permissionLevel) {
        if (!await this.client.utility.music.hasPermissions(message, this)) return;
        
        const connection = message.guild.voiceConnection;

        if (!connection) return message.send(`Nothing is currently streaming.`);

        if (connection.guildStream.mode !== "queue") return message.error("This command only works while in queue mode.");

        const args = /(.+)/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const queue = connection.guildStream.queue;
        const query = args[1];

        const results = queue.filter(v => v.title.toLowerCase().includes(query.toLowerCase()));

        if (!results.length) return message.error(`No results were found in the queue for the query **${query}**.`);

        if (results.length > 1) {
            const videos = results.map((v, i) => `**${i + 1}:** ${v.title}`).join("\n");

            message.send(`Multiple videos were found that matched your query. Type \`cancel\` to cancel or \`all\` to remove all. Otherwise, select from the videos listed below:\n\n${videos}`);

            const messages = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 10000, errors: ["time"] }).catch(err => { return null; });
            
            if (!messages) return message.error("No response was given.");

            const m = messages.first();

            if (m.content === "cancel") {
                message.reply("Canceled.");
            } else if (m.content === "all") {
                results.forEach(v => {
                    queue.splice(queue.indexOf(v), 1);
                });

                message.reply(`Removed **${results.length}** videos from the queue.`);
            } else if ((/^\d+$/).test(m.content)) {
                queue.splice(queue.indexOf(results[m.content - 1]), 1);

                message.reply(`Removed **${results[0].title}** videos from the queue.`);
            } else {
                return message.error("Please provide a number, say `all`, or `cancel`.");
            }
        } else {
            queue.splice(queue.indexOf(results[0].title), 1);

            message.reply(`Removed **${results[0].title}** from the queue.`);
        }
    }
};
