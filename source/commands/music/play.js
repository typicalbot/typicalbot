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

    async execute(message, parameters, permissionLevel) {
        if (!await this.client.utility.music.hasPermissions(message, this)) return;

        const match = /(.+)/i.exec(parameters);
        if (!match) return message.error(this.client.functions.error("usage", this)); 

        const args = /(?:(?:https?:\/\/www\.youtube\.com\/playlist\?list=(.+))|(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+))/i.exec(parameters);
        
        if (args && args[1]) {
            this.client.handlers.music.stream(message, args[1], true).catch(err => message.error(err.stack || err));
        } else if (args && args[2]) {
            this.client.utility.music.fetchInfo(args[2], message).then(videoInfo => {
                videoInfo.url = args[2];

                this.client.handlers.music.stream(message, videoInfo).catch(err => message.error(err.stack || err));
            }).catch(err => message.error(`Information cannot be fetched from that song. Please try another url.`));
        } else {
            this.client.utility.music.search(message.guild.settings, match[1]).then(results => {
                if (!results.length) return message.reply(`No results were found for the query **${match[1]}**.`);
                const video = results[0];

                this.client.utility.music.fetchInfo(video.url, message).then(videoInfo => {
                    videoInfo.url = video.url;

                    this.client.handlers.music.stream(message, videoInfo).catch(err => message.error(err.stack || err));
                }).catch(err => message.error(`Information cannot be fetched from that song. Please try another song name.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
            }).catch(error => message.error(`${this.client.utility.music.searchError(error)}`));
        }
    }
};
