const Command = require("../../Structures/Command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "play",
            description: "Streams a video from YouTube.",
            usage: "play <video-name|url>",
            mode: "lite"
        });

        this.client = client;
    }

    execute(message, response, permissionLevel) {
        let match = /play\s+(.+)/i.exec(message.content);
        if (!match) return response.usage("play");

        let url = /(?:https?\:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be)\/(.+)/i.exec(match[1]);

        if (url) {
            this.client.audioUtility.fetchInfo(url[1]).then(videoInfo => {
                videoInfo.url = url[1];
                return this.client.audioManager.stream(response, videoInfo);
            }).catch(err => response.error(`Information cannot be fetched from that video. Please try another url.`));
        } else {
            this.client.audioUtility.search(message.guild.settings, match[1]).then(results => {
                if (!results.length) return response.reply(`No results were found for the query **${match[1]}**.`);
                let video = results[0];

                this.client.audioUtility.fetchInfo(video.url).then(videoInfo => {
                    videoInfo.url = video.url;
                    this.client.audioManager.stream(response, videoInfo).catch(err => response.error(`An error occured while trying to stream a video.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
                }).catch(err => response.error(`Information cannot be fetched from that video. Please try another video name.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
            }).catch(error => response.error(`${this.client.audioUtility.searchError(error)}`));
        }
    }
};
