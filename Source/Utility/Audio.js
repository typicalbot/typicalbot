const ytdl = require("ytdl-core");
const SYS = require("simple-youtube-stream");
const sys = new SYS();

const vr = require("../../version").version;
const apiKey = require(`../../Configs/${vr}`).youtubekey;

const YAPI = require("simple-youtube-api");
const TBYT = new YAPI(apiKey);

class AudioUtil {
    constructor(client) {
        this.client = client;
    }

    fetchInfo(url) {
        return new Promise((resolve, reject) => {
            ytdl.getInfo(url, (err, info) => {
                if (err) return reject(err);
                return resolve({ title: info.title, length_seconds: info.length_seconds, url });
            });
        });
    }

    validate(url) {
        return new Promise((resolve, reject) => {
            return sys.fetchInfo(url).then(resolve).catch(reject);
        });
    }

    fethcStream(video) {
        return new Promise((resolve, reject) => {
            this.validate(video.url).then(() => {
                let audioStream = ytdl(video.url, { filter: "audioonly" });
                return resolve(audioStream);
            }).catch(reject);
        });
    }

    search(settings, query) {
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

    searchError(error) {
        if (!error.errors) return `An unknown error occured while requesting that video:\n${error.stack}`;
        const err = error.errors[0].reason;
        if (!err) return `An unknown error occured while requesting that video:\n${error}`;
        if (err === "keyInvalid") return "**__An unknown error occured while requesting that video:__**\n\nThis server entered an invalid YouTube API Key.";
        else if (err === "quotaExceeded") return "**__An error occured while requesting that video:__**\n\nOur Global YouTube API Quota limit exceeded, meaning no more searches can be made until it is reset at 3 AM EST.\n\n**__How to Resolve the Issue:__**\n```md\n# You can resolve the issue by creating your own YouTube Data API v3 Key.\n\n< Join TypicalBot\'s server and use the command '/tag apikeyhowto' for more information on how to do so.```\n**Link:** <https://typicalbot.com/join-our-server/>";
        else return `An unknown error occured while requesting that video:\n${err}`;
    }
}

module.exports = AudioUtil;
