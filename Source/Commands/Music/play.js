const Command = require("../../Structures/Command.js");

const vr = require("../../../version").version;
const apiKey = require(`../../../Configs/${vr}`).youtubekey;

const YAPI = require("simple-youtube-api");
const TBYT = new YAPI(apiKey);

function search(settings, query) {
    return new Promise((resolve, reject) => {
        let YT = settings.apikey ? new YAPI(settings.apikey) : TBYT;
        YT.search(query, 10).then(results => {
            let filtered = results.filter(a => a.type === "video");
            return resolve(filtered);
        }).catch(error => {
            return reject(error);
        });
    });
}

function errorMessage(error) {
    if (!error.errors) return `An unknown error occured while requesting that video:\n${error.stack}`;
    const err = error.errors[0].reason;
    if (!err) return `An unknown error occured while requesting that video:\n${error}`;
    if (err === "keyInvalid") return "**__An unknown error occured while requesting that video:__**\n\nThis server entered an invalid YouTube API Key.";
    else if (err === "quotaExceeded") return "**__An error occured while requesting that video:__**\n\nOur Global YouTube API Quota limit exceeded, meaning no more searches can be made until it is reset at 3 AM EST.\n\n**__How to Resolve the Issue:__**\n```md\n# You can resolve the issue by creating your own YouTube Data API v3 Key.\n\n< Join TypicalBot\'s server and use the command '/tag apikeyhowto' for more information on how to do so.```\n**Link:** <https://typicalbot.com/join-our-server/>";
    else return `An unknown error occured while requesting that video:\n${err}`;
}

module.exports = class extends Command {
    constructor(client) {
        super(client, {
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
            this.client.audioManager.fetchInfo(url[1]).then(videoInfo => {
                videoInfo.url = url[1];
                return this.client.audioManager.createStream(response, videoInfo);
            }).catch(err => response.error(`Information cannot be fetched from that video. Please try another url.`));
        } else {
            search(message.guild.settings, match[1]).then(results => {
                if (!results.length) return response.reply(`No results were found for the query **${match[1]}**.`);
                let video = results[0];

                this.client.audioManager.fetchInfo(video.url).then(videoInfo => {
                    videoInfo.url = video.url;
                    this.client.audioManager.createStream(response, videoInfo).catch(err => response.error(`An error occured while trying to stream a video.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
                }).catch(err => response.error(`Information cannot be fetched from that video. Please try another video name.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
            }).catch(error => response.error(`${errorMessage(error)}`));
        }
    }
};
