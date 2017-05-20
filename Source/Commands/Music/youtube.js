const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "youtube",
            description: "Search for a video from YouTube.",
            usage: "youtube <query>",
            aliases: ["yts"],
            mode: "lite"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let match = /(?:youtube|yts)\s+(.+)/i.exec(message.content);
        if (!match) return response.usage("youtube");

        this.client.audioUtility.search(message.guild.settings, match[1]).then(results => {
            if (!results.length) return response.reply(`No results were found for the query **${match[1]}**.`);
            let video = results[0];

            response.reply(`**${video.title}** by **${video.channel.title}**:\n<${video.url}>`);
        }).catch(error => response.error(`${this.client.audioUtility.searchError(error)}`));
    }
};
