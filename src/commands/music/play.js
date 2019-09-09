const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Streams a song to a voice channel from YouTube.",
            usage: "play <video-name|url>",
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters) {
        if (!await this.client.utility.music.hasPermissions(message, this)) return;

        const args = /(.+)/i.exec(parameters);

        if (!args) return message.error(this.client.functions.error("usage", this));

        const url = /(?:(?:https?:\/\/www\.youtube\.com\/playlist\?list=(.+))|(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+))/i.exec(parameters);

        if (url && url[1])
            this.client.handlers.music.stream(message, url[1], true).catch(err => message.error(err.stack || err));

        else if (url && url[2])
            this.client.utility.music.fetchInfo(url[2], message).then(async video => {
                if (video.live && (await this.client.functions.fetchAccess(message.guild)).level < 1)
                    return message.error("This feature is only available to TypicalBot Prime members.");

                this.client.handlers.music.stream(message, video).catch(err => message.error(err.stack || err));
            }).catch(err => message.error(`Information cannot be fetched from that song. Please try another url.`));

        else
            this.client.utility.music.search(message.guild.settings, args[1]).then(results => {
                if (!results.length) return message.reply(`No results were found for the query **${args[1]}**.`);

                this.client.utility.music.fetchInfo(results[0].url, message).then(video =>
                    this.client.handlers.music.stream(message, video).catch(err => message.error(err.stack || err))
                ).catch(err => message.error(`Information cannot be fetched from that song. Please try another song name.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
            }).catch(error => message.error(`${this.client.utility.music.searchError(error)}`));
    }
};
