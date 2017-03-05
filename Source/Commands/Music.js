const apikey = require("../../config.json").youtubekey;
const yta = require("simple-youtube-api");
const yt = new yta(apikey);
const ytdl = require("ytdl-core");

function canUse(message, command, level) {
    let musicperms = message.guild.settings.musicperms;
    let override = message.guild.settings[`or${command}`];
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

module.exports = {
    "youtube": {
        mode: "lite",
        aliases: ["yts"],
        usage: {"command": "youtube <query>", "description": "Searches for a video on YouTube."},
        execute: (message, client, response) => {
            let match = /(?:youtube|yts)\s+(.+)/i.exec(message.content);
            if (!match) return response.usage("youtube");

            search(message.guild.settings, match[1]).then(results => {
                if (!results.length) return response.reply(`No results were found for the query **${match[1]}**.`);

                let video = results[0];

                response.reply(`**${video.title}** by **${video.channel.title}**:\n<${video.url}>`);
            }).catch(error => response.error(`${errorMessage(error)}`));
        }
    },
    "play": {
        mode: "lite",
        permission: 0,
        usage: {"command": "play <video-url|video-name>", "description": "Streams a YouTube video's audio to a voice channel."},
        execute: (message, client, response, level) => {
            if (!canUse(message, "play", level)) return response.error(`This server has elevated permissions for this command.`);

            let match = /play\s+(.+)/i.exec(message.content);
            if (!match) return response.usage("play");

            let url = /(?:https?\:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be)\/(.+)/i.exec(match[1]);
            if (url) {
                client.audioManager.fetchInfo(url[1]).then(videoInfo => {
                    videoInfo.url = url[1];
                    return client.audioManager.playVideo(response, videoInfo);
                }).catch(err => response.error(`Information cannot be fetched from that video. Please try another url or video name.`));
            } else {
                search(message.guild.settings, match[1]).then(results => {
                    if (!results.length) return response.error(`No results were found for the query **${match[1]}**.`);
                    let video = results[0];

                    client.audioManager.fetchInfo(video.url).then(videoInfo => {
                        videoInfo.url = video.url;
                        return client.audioManager.playVideo(response, videoInfo);
                    }).catch(err => response.error(`Information cannot be fetched from that video. Please try another url or video name.`));
                }).catch(() => {
                    response.error(`An error occured making that search.`);
                });
            }
        }
    },
    "queue": {
        mode: "lite",
        usage: {"command": "queue", "description": "Lists all of the videos in the queue to play."},
        execute: (message, client, response) => {
            let connection = message.guild.voiceConnection;
            if (!connection) return response.send(`Nothing is currently streaming.`);

            let stream = client.streams.get(message.guild.id);
            let queue = stream.queue;

            let short = text => client.functions.shorten(text), time = len => client.functions.length(len);

            if (!queue.length) return  response.send(`**__Queue:__** There are no videos in the queue.\n\n**__Currently Streaming:__** **${short(stream.current.title)}** (${time(stream.current.length_seconds)}) | Requested by **${stream.current.response.message.author.username}**`);

            let list = queue.slice(0, 10);

            let content = list.map(s => `● **${short(s.title)}** (${time(s.length_seconds)}) | Requested by **${s.response.message.author.username}**`).join("\n");
            let length = 0; queue.forEach(s => length += Number(s.length_seconds));

            response.send(`**__Queue:__** There are **${queue.length}** videos in the queue. The queue will last for **${time(length)}.**\n\n${content}${queue.length > 10 ? `\n*...and ${queue.length - 10} more.*` : ""}\n\n**__Currently Streaming:__** **${short(stream.current.title)}** (${time(stream.current.length_seconds)}) | Requested by **${stream.current.response.message.author.username}**`);
        }
    },
    "current": {
        mode: "lite",
        aliases: ["np","playing"],
        usage: {"command": "current", "description": "Displays the video currently streaming."},
        execute: (message, client, response) => {
            let connection = message.guild.voiceConnection;
            if (!connection) return response.send(`Nothing is currently streaming.`);

            let stream = client.streams.get(message.guild.id);
            let short = text => client.functions.shorten(text), time = len => client.functions.length(len);

            let remaining = stream.current.length_seconds - Math.floor(stream.dispatcher.time / 1000);

            response.send(`**__Currently Streaming:__** **${short(stream.current.title)}** (${time(remaining)} left) | Requested by **${stream.current.response.message.author.username}**`);
        }
    },
    /*
    "unqueue": {
        mode: "lite",
        usage: {"command": "unqueue <queue_id>", "description": "Remove a song from the queue."},
        execute: (message, client, response, level) => {
            if (!canUse(message, "play", level)) return response.error(`This server has elevated permissions for this command.`);

            let match = /unqueue\s+(\d+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            let queueid = match[1];

            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            if (!message.member.voiceChannel || connection.channel.id !== message.member.voiceChannel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);

            let stream = client.streams.get(message.guild.id);
            let queue = stream.queue;
            let short = text => client.functions.shorten(text);
            let item = queue[queueid - 1];

            if (!item) return message.channel.sendMessage(`${message.author} | There is no video under that queue id.`);

            queue.splice(queue.indexOf(item), 1);
            message.channel.sendMessage(`${message.author} | Removed **${short(item.info.title)}** from the queue.`);
        }
    },
    */
    "volume": {
        mode: "lite",
        usage: {"command": "volume <percent:0-200>", "description": "Changes the volume of the video streaming."},
        execute: (message, client, response, level) => {
            if (!canUse(message, "volume", level)) return response.error(`This server has elevated permissions for this command.`);

            let match = /volume\s+(\d+)/i.exec(message.content);
            if (!match) return response.error(`Invalid command usage. Volume must be a percent from 0% to 200%.`);

            let volume = match[1];
            if (volume < 0 || volume > 200) return response.error(`Invalid command usage. Volume must be a percent from 0% to 200%.`);

            let connection = message.guild.voiceConnection;
            if (!connection) return response.send(`Nothing is currently streaming.`);

            let stream = client.streams.get(message.guild.id);

            stream.setVolume(volume * 0.01);

            response.reply(`Changed the volume to **${volume}%**.`);
        }
    },
    "skip": {
        mode: "lite",
        usage: {"command": "volume <percent:0-200>", "description": "Skips the video currently streaming."},
        execute: (message, client, response, level) => {
            if (!canUse(message, "skip", level)) return response.error(`This server has elevated permissions for this command.`);

            let connection = message.guild.voiceConnection;
            if (!connection) return response.send(`Nothing is currently streaming.`);

            let stream = client.streams.get(message.guild.id);

            let short = text => client.functions.shorten(text);

            let song = stream.skip();

            response.reply(`Skipped **${short(song.title)}**.`);
        }
    },
    "pause": {
        mode: "lite",
        usage: {"command": "pause", "description": "Pauses the video currently streaming."},
        execute: (message, client, response, level) => {
            if (!canUse(message, "pause_resume", level)) return response.error(`This server has elevated permissions for this command.`);

            let connection = message.guild.voiceConnection;
            if (!connection) return response.send(`Nothing is currently streaming.`);

            let stream = client.streams.get(message.guild.id);

            stream.pause();

            response.reply(`Paused the stream.`);
        }
    },
    "resume": {
        mode: "lite",
        usage: {"command": "pause", "description": "Resumes the video currently streaming."},
        execute: (message, client, response, level) => {
            if (!canUse(message, "pause_resume", level)) return response.error(`This server has elevated permissions for this command.`);

            let connection = message.guild.voiceConnection;
            if (!connection) return response.send(`Nothing is currently streaming.`);

            let stream = client.streams.get(message.guild.id);

            stream.resume();

            response.reply(`Resumed the stream.`);

        }
    },
    "stop": {
        mode: "lite",
        usage: {"command": "stop", "description": "Stops the current stream and clears the queue."},
        execute: (message, client, response, level) => {
            if (!canUse(message, "stop", level)) return response.error(`This server has elevated permissions for this command.`);

            let connection = message.guild.voiceConnection;
            if (!connection) return response.send(`Nothing is currently streaming.`);

            let stream = client.streams.get(message.guild.id);

            stream.kill();
        }
    }


/*
    "play": {
        mode: "lite",
        permission: 0,
        usage: {"command": "play <video-url|video-name>", "description": "In Progress"},
        execute: (message, client, response) => {
            let connection = message.guild.voiceConnection;
            if (connection) return response.error(`Audio is already playing in this server. Queues are not yet supported until it can be worked on. This is a first-step in figuring out any memory leak problems.`);
            let match = /play\s+(.+)/i.exec(message.content);
            if (!match) return response.error(`Invalid command usage.`);
            let url = /(?:https?\:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be)\/(.+)/i.exec(match[1]);
            if (url) return process(message, client, response, url[1]);
            search(message.guild.settings, match[1]).then(results => {
                if (!results.length) return response.error(`No results were found for the query **${match[1]}**.`);
                let video = results[0];
                return process(message, client, response, video.url);
            }).catch(() => {
                response.error(`An error occured.`);
            });
        }
    },
    "stop": {
        mode: "lite",
        permission: 0,
        usage: {"command": "play <video-url|video-name>", "description": "In Progress"},
        execute: (message, client, response) => {
            let connection = message.guild.voiceConnection;
            if (!connection) return response.error(`No audio is playing.`);
            let stream = client.streams.get(message.guild.id);
            stream.queue = [];
            connection.disconnect();
        }
    }
    */
};

function search(settings, query) {
    return new Promise((resolve, reject) => {
        let YT = settings.apikey ? new yta(settings.apikey) : yt;
        YT.search(query, 10).then(results => {
            let filtered = results.filter(a => a.type === "video");
            return resolve(filtered);
        }).catch(error => {
            return reject(error);
        });
    });
}
