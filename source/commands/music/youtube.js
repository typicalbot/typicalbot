const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Search for a video from YouTube.",
            usage: "youtube <query>",
            aliases: ["yts"],
            mode: Constants.Modes.LITE
        });
    }

    execute(message, parameters, permissionLevel) {
        const match = /(.+)/i.exec(parameters);

        if (!match) return message.error(this.client.functions.error("usage", this));

        this.client.utility.music.search(message.guild.settings, match[1]).then(results => {
            if (!results.length) return message.reply(`No results were found for the query **${match[1]}**.`);
            
            const video = results[0];

            message.reply(`**${video.title}** by **${video.channel.title}**:\n<${video.url}>`);
        }).catch(error => message.error(`${this.client.utility.music.searchError(error)}`));
    }
};
