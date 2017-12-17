const ytdl = require("ytdl-core");
const SYS = require("simple-youtube-stream");
const sys = new SYS();

const build = require("../../build");
const apiKey = require(`../../configs/${build}`).youtubekey;

const YAPI = require("simple-youtube-api");
const TBYT = new YAPI(apiKey);

class AudioUtil {
    constructor(client) {
        this.client = client;
    }

    withinLimit(message, video) {
        return video.length_seconds <= (message.guild.settings.lengthLimit || 1800) ? true : false;
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
        const id = /[a-zA-Z0-9-_]{11}$/.exec(url);
        if (id) url = id;
        return new Promise((resolve, reject) => {
            return sys.fetchInfo(url).then(resolve).catch(reject);
        });
    }

    fetchStream(video) {
        return new Promise((resolve, reject) => {
            this.validate(video.url).then(() => {
                const audioStream = ytdl(video.url, { filter: "audioonly" });
                return resolve(audioStream);
            }).catch(reject);
        });
    }

    async fetchPlaylist(message, id) {
        const YT = message.guild.settings.music.apikey ? new YAPI(message.guild.settings.music.apikey) : TBYT;

        const playlist = await YT.getPlaylistByID(id).catch(err => { throw err; });
        const videos = await playlist.getVideos().catch(err => { throw err; });

        const queue = [];
        
        videos.forEach(async v => {
            this.validate(v.url).then(() => {
                queue.push(v.url);
            }).catch(err => { return; });
        });

        return queue;
    }

    search(settings, query) {
        return new Promise((resolve, reject) => {
            const YT = settings.music.apikey ? new YAPI(settings.music.apikey) : TBYT;
            YT.search(query, 10).then(results => {
                const filtered = results.filter(a => a.type === "video");
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
        else if (err === "quotaExceeded") return "**__An error occured while requesting that video:__**\n\nOur Global YouTube API Quota limit exceeded, meaning no more searches can be made until it is reset at 3 AM EST.\n\n**__How to Resolve the Issue:__**\n```md\n# You can resolve the issue by creating your own YouTube Data API v3 Key.\n\n< Join TypicalBot's server and use the command '/tag apikeyhowto' for more information on how to do so.```\n**Link:** <https://typicalbot.com/join-our-server/>";
        else return `An unknown error occured while requesting that video:\n${err}`;
    }

    permissionCheck(message, command, permissions) {
        const level = permissions.level;

        const musicperms = message.guild.settings.music.default;
        const override = message.guild.settings.music[`${command.name}`];
        if (override === "off") if (musicperms === "all" || musicperms === "dj" && level >= 1 || musicperms === "moderator" && level >= 2 || musicperms === "administrator" && level >= 3) return { has: true };
        if (override === "all" || override === "dj" && level >= 1 || override === "moderator" && level >= 2 || override === "administrator" && level >= 3) return { has: true };
        return { has: false, req: override === "off" ? musicperms : override };
    }

    hasPermissions(message, command) {
        const userTrueLevel = this.client.permissionsManager.get(message.guild, message.author, true);

        const permissionCheck = this.permissionCheck(message, command, userTrueLevel);
        if (permissionCheck.has) { return true; } else {
            message.elevation(this, userTrueLevel, permissionCheck.req === "dj" ? 1 : permissionCheck.req === "moderator" ? 2 : permissionCheck.req === "administrator" ? 3 : 0 );
            return false;
        }
    }
}

module.exports = AudioUtil;
