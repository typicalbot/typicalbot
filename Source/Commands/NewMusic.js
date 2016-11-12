const apikey = require("../Config").youtubekey;
const YouTubeAPI = require("simple-youtube-api");
const YouTube = new YouTubeAPI(apikey);

module.exports = {
    "youtube": {
        aliases: ["yts"],
        usage: {"command": "youtube <query>", "description": "Searches for a video on YouTube."},
        execute: (message, client) => {
            let match = /(?:youtube|yts)\s+(.+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            VideoSearch(client, message.guild.settings, match[1]).then(results => {
                if (!results.length) return message.channel.sendMessage(`${message.author} | \`❌\` | No results were found for the query **${match[1]}**.`);
                let video = results[0];
                message.channel.sendMessage(`${message.author} | **${video.title}** by **${video.channel.title}**:\n<${video.url}>`);
            }).catch(error => message.channel.sendMessage(`${message.author} | \`❌\` | ${errorMessage(error)}`));
        }
    }
};

function checkOverride(client, guild, user, command, level) {
    let musicperms = guild.settings.musicperms;
    let override = guild.settings[`or-${command}`];
    if (override === "off") if (musicperms === "all" || musicperms === "dj" && level >= 1 || musicperms === "admin" && level >= 2) return true;
    if (override === "all" || override === "dj" && level >= 1 || override === "admin" && level >= 2) return true;
    return false;
}

function errorMessage(error) {
    if (!error.errors) return `An unknown error occured while requesting that video:\n${error.stack}`;
    const err = error.errors[0].reason;
    if (!err) return `An unknown error occured while requesting that video:\n${error}`;
    if (err === "keyInvalid") return "**__An unknown error occured while requesting that video:__**\n\nThis server entered an invalid YouTube API Key.";
    else if (err === "quotaExceeded") return "**__An error occured while requesting that video:__**\n\nOur Global YouTube API Quota limit exceeded, meaning no more searches can be made until it is reset at 3 AM EST.\n\n**__How to Resolve the Issue:__**\n```md\n# You can resolve the issue by creating your own YouTube Data API v3 Key.\n\n< Join TypicalBot\'s server and use the command '/tag apikeyhowto' for more information on how to do so.```\n**Link:** <https://typicalbot.com/join-our-server/>";
    else return `An unknown error occured while requesting that video:\n${err}`;
}

function VideoSearch(client, settings, query) {
    return new Promise((resolve, reject) => {
        let YT = settings.apikey ? new YouTubeAPI(settings.apikey) : YouTube;
        YT.search(query, 10).then(results => {
            return resolve(results.filter(a => a.type === "video"));
        }).catch(error => {
            return reject(error);
        });
    });
}
