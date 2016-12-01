const apikey = require("../Config").youtubekey;
const YouTubeAPI = require("simple-youtube-api");
const YouTube = new YouTubeAPI(apikey);
const ytdl = require("ytdl-core");

module.exports = {
    "youtube": {
        mode: "lite",
        aliases: ["yts"],
        usage: {"command": "youtube <query>", "description": "Searches for a video on YouTube."},
        execute: (message, client) => {
            let match = /(?:youtube|yts)\s+(.+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            search(client, message.guild.settings, match[1]).then(results => {
                if (!results.length) return message.channel.sendMessage(`${message.author} | \`❌\` | No results were found for the query **${match[1]}**.`);
                let video = results[0];
                message.channel.sendMessage(`${message.author} | **${video.title}** by **${video.channel.title}**:\n<${video.url}>`);
            }).catch(error => message.channel.sendMessage(`${message.author} | \`❌\` | ${newerror(error)}`));
        }
    },
    "play": {
        mode: "lite",
        usage: {"command": "play <video_name/video_url>", "description": "Plays audio."},
        execute: (message, client, level) => {
            console.log(`PLAY | ${message.guild.id} | ${client.data.voiceConnections}`);
            if (!checkOverride(message, "play", level)) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command due to music permissions changed.`);
            let url = message.content.search("youtu") > -1 ? (()=>{
                let query = /(?:https?\:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be)\/.+/i.exec(message.content);
                if (query) return query[1]; return null;
            })() : null;

            if (url) return process(client, message, url);
            let query = /play\s+(.+)/i.exec(message.content);
            if (!query) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage.`);
            search(client, message.guild.settings, query[1]).then(results => {
                if (!results.length) return message.channel.sendMessage(`${message.author} | \`❌\` | No results were found for the query **${query[1]}**.`);
                let video = results[0];
                return process(client, message, video.url);
            }).catch(error => message.channel.sendMessage(`${message.author} | \`❌\` | ${newerror(error)}`));
        }
    },
    "queue": {
        mode: "lite",
        usage: {"command": "queue", "description": "Displays the queue of songs to play."},
        execute: (message, client, level) => {
            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`**__Queue:__** There are no songs in the queue.\n\n**Currently Playing:** Nothing`);

            let stream = client.streams.get(message.guild.id);
            let queue = stream.queue;
            let short = text => client.functions.shorten(text), time = len => client.functions.length(len);
            if (!queue.length) return  message.channel.sendMessage(`**__Queue:__** There are no songs in the queue.\n\n**Currently Playing:**  ${short(stream.current.info.title)} (${time(stream.current.info.length_seconds)}) | Requested by **${stream.current.message.author.username}**`);

            let songs = queue.length > 10 ? queue.slice(0, 10) : queue;
            let content = songs.map(s => `● **${short(s.info.title)}** (${time(s.info.length_seconds)}) | Requested by **${s.message.author.username}**`).join("\n");
            let length = 0; queue.forEach(s => length += Number(s.info.length_seconds));

            message.channel.sendMessage(`**__Queue:__** There are ${queue.length} songs in the queue. The queue will last for **${time(length)}.**\n\n${content}${queue.length > 10 ? `\n*...and ${queue.length - 10} more.*` : ""}\n\n**Currently Playing:** ${short(stream.current.info.title)} (${time(stream.current.info.length_seconds)})`);
        }
    },
    "current": {
        mode: "lite",
        aliases: ["np","playing"],
        usage: {"command": "current", "description": "Displays the currently playing song."},
        execute: (message, client, level) => {
            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            let stream = client.streams.get(message.guild.id);
            let short = text => client.functions.shorten(text), time = len => client.functions.length(len);
            let remaining = stream.current.info.length_seconds - Math.floor(connection.player.dispatcher.time / 1000);
            message.channel.sendMessage(`**__Currently Playing:__** ${short(stream.current.info.title)} | ${time(remaining)} left | Requested by **${stream.current.message.author.username}**`);
        }
    },
    "unqueue": {
        mode: "lite",
        usage: {"command": "unqueue <queue_id>", "description": "Remove a song from the queue."},
        execute: (message, client, level) => {
            if (!checkOverride(message, "unqueue", level)) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command.`);
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
    "skip": {
        mode: "lite",
        usage: {"command": "skip", "description": "Skips the currently playing song."},
        execute: (message, client, level) => {
            if (!checkOverride(message, "skip", level)) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command.`);
            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            if (!message.member.voiceChannel || connection.channel.id !== message.member.voiceChannel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);

            let stream = client.streams.get(message.guild.id);
            let short = text => client.functions.shorten(text);

            message.channel.sendMessage(`${message.author} | Skipped **${short(stream.current.info.title)}**.`).then(msg => {
                connection.player.dispatcher.end();
            });
        }
    },
    "pause": {
        mode: "lite",
        usage: {"command": "pause", "description": "Pauses the song currently playing."},
        execute: (message, client, level) => {
            if (!checkOverride(message, "pause_resume", level)) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command.`);
            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            if (!message.member.voiceChannel || connection.channel.id !== message.member.voiceChannel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);

            connection.player.dispatcher.pause();
            message.channel.sendMessage(`${message.author} | Paused.`);
        }
    },
    "resume": {
        mode: "lite",
        usage: {"command": "resume", "description": "Resumes the song currently playing."},
        execute: (message, client, level) => {
            if (!checkOverride(message, "pause_resume", level)) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command.`);
            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            if (!message.member.voiceChannel || connection.channel.id !== message.member.voiceChannel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);

            connection.player.dispatcher.resume();
            message.channel.sendMessage(`${message.author} | Resumed.`);
        }
    },
    "stop": {
        mode: "lite",
        usage: {"command": "stop", "description": "Stops the currently playing song and clears the queue."},
        execute: (message, client, level) => {
            if (!checkOverride(message, "stop", level)) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command.`);
            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            if (!message.member.voiceChannel || connection.channel.id !== message.member.voiceChannel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);

            let stream = client.streams.get(message.guild.id);

            stream.queue = [];
            connection.disconnect();
        }
    },
    "volume": {
        mode: "lite",
        usage: {"command": "volume <number>", "description": "Stops the currently playing song and clears the queue."},
        execute: (message, client, level) => {
            if (!checkOverride(message, "volume", level)) return message.channel.sendMessage(`${message.author} | \`❌\` | Your permission level is too low to execute that command.`);
            let match = /volume\s+(\d+)/i.exec(message.content);
            if (!match) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage. Volume must be a percent from 0% to 200%.`);

            let volume = match[1];
            if (volume < 0 || volume > 200) return message.channel.sendMessage(`${message.author} | \`❌\` | Invalid command usage. Volume must be a percent from 0% to 200%.`);

            let connection = message.guild.voiceConnection;
            if (!connection) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            if (!message.member.voiceChannel || connection.channel.id !== message.member.voiceChannel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);

            if (!connection.player || !connection.player.dispatcher) return message.channel.sendMessage(`${message.author} | Nothing is playing.`);

            connection.player.dispatcher.setVolume(volume * 0.01);
            message.channel.sendMessage(`${message.author} | Changed the volume to **${volume}%**.`);
        }
    }
};

const newerror = error => {
    if (!error.errors) return `An unknown error occured while requesting that video:\n${error}`;
    const err = error.errors[0].reason;
    if (!err) return `An unknown error occured while requesting that video:\n${error}`;
    if (err === "keyInvalid") return "**__An unknown error occured while requesting that video:__**\n\nThis server entered an invalid YouTube API Key.";
    else if (err === "quotaExceeded") return "**__An error occured while requesting that video:__**\n\nOur Global YouTube API Quota limit exceeded, meaning no more searches can be made until it is reset at 3 AM EST.\n\n**__How to Resolve the Issue:__**\n```md\n# You can resolve the issue by creating your own YouTube Data API v3 Key.\n\n< Join TypicalBot\'s server and use the command '/tag apikeyhowto' for more information on how to do so.```\n**Link:** <https://typicalbot.com/join-our-server/>";
    else return `An unknown error occured while requesting that video:\n${err}`;
};

const checkOverride = (message, command, level) => {
    let musicperms = message.guild.settings.musicperms;
    let override = message.guild.settings[`or${command}`];
    if (override === "off") if (musicperms === "all" || musicperms === "dj" && level >= 1 || musicperms === "admin" && level >= 2) return true;
    if (override === "all" || override === "dj" && level >= 1 || override === "admin" && level >= 2) return true;
    return false;
};

const search = (client, settings, query) => {
    return new Promise((resolve, reject) => {
        let YT = settings.apikey ? new YouTubeAPI(settings.apikey) : YouTube;
        YT.search(query, 10).then(results => {
            let filtered = results.filter(a => a.type === "video");
            return resolve(filtered);
        }).catch(error => {
            return reject(error);
        });
    });
};

const process = (client, message, video) => {
    try {
        ytdl.getInfo(video, (error, info) => {
            if (error) return message.channel.sendMessage(`${message.author} | \`❌\` | An Error Occured:\`${error}\``);
            client.music.startconnection(client, message, video, info);
        });
    } catch(error) {
        message.channel.sendMessage(`${message.author} | \`❌\` | An Error Occured:\`${error}\``);
    }
};
