const apikey = require("../../config.json").youtubekey;
const yta = require("simple-youtube-api");
const yt = new yta(apikey);
const ytdl = require("ytdl-core");

module.exports = {
    "triggers": {
        mode: "strict",
        permission: 6,
        usage: {"command": "trigger", "description": "In Progress"},
        execute: (message, client, response) => {
            let match = message.content.match(/triggers\s+(add|remove|edit|view|list)(?:\s+(.+))?/i);
            if (!match) return response.error("Invalid command usage.");
            let action = match[1];
            if (action === "add") {
                let values = match[2];
                if (!values) return response.error("Invalid command usage.");
                let tr = values.match(/(.+(?!\|))\s*\|\s*(?:{(.+)}\s*)?((?:.|[\r\n])+)/i);
                if (!tr) return response.error("Invalid command usage.");
                let trigger = tr[1];
                let options = tr[2] || [];
                let resp = tr[3];
                client.settings.connection.query(`INSERT INTO triggers SET ?`, {
                    guildid: message.guild.id,
                    trigger,
                    exact: options.includes("exact") ? "Y" : "N",
                    dm: options.includes("dm") ? "Y" : "N",
                    response: resp,
                });
            }
        }
    },
    "play": {
        mode: "lite",
        usage: {"command": "play", "description": "Disabled"},
        execute: (message, client, response) => {
            /*response.send("**Play has been disabled!**", {
                "color": 0xFF0000,
                "description": "**We're sorry to say, but music has been disabled.**\n**  --  --  --  --  --  **",
                "fields": [
                    { name: "**❯ Why!?!?!?!**", value: "Play has been disabled to do a problem with music causing a memory leak." },
                    { name: "**❯ How do I fix this?**", value: "Sadly, you can't. When the problem is fixed, you will get access to it." },
                    { name: "**❯ What's a memory leak?**", value: "In [computer science](https://en.wikipedia.org/wiki/Computer_science), a **memory leak** is a type of [resource leak](https://en.wikipedia.org/wiki/Resource_leak) that occurs when a [computer program](https://en.wikipedia.org/wiki/Computer_program) incorrectly manages [memory allocations](https://en.wikipedia.org/wiki/Memory_allocation) in such a way that memory which is no longer needed is not released. In [object-oriented programming](https://en.wikipedia.org/wiki/Object-oriented_programming), a memory leak may happen when an object is stored in memory but cannot be accessed by the running code. A memory leak has symptoms similar to a number of other problems and generally can only be diagnosed by a programmer with access to the program's source code.\n\n[Wikipedia](https://en.wikipedia.org/wiki/Memory_leak)" },
                    { name: "**❯ When will it be fixed!?!??!?!?!**", value: "There's no estimated time it will be fixed. Alternatively, you can `$subscribe` to get an announcement when something happens." },
                    { name: "**❯ I WANT MUSIC NOW!!!!**", value: "You could try our partnered bot Ender. To get more information about Ender go to [https://enderbot.xyz](https://enderbot.xyz)." },
                    { name: "\u200B", value: "\u200B" },
                    { name: "**❯ Join Our Server**", value: "Click [here](https://typicalbot.com/join-our-server/) or copy and paste [https://typicalbot.com/join-our-server/](https://typicalbot.com/join-our-server/)" }
                ]
            });*/
            response.error(`TypicalBot no longer supports music for the time being due to a memory leak. You can get another bot created by the same person called HyperCast at <https://typicalbot.com/hypercast/> that'll give you access to 24/7 and queue-less music. You can compare it to a car radio, if you would like to. Support will be provided in <https://typicalbot.com/partners/hypercast/>.`);
        }
    }
    /*
    "play": {
        mode: "lite",
        permission: 6,
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
        permission: 6,
        usage: {"command": "play <video-url|video-name>", "description": "In Progress"},
        execute: (message, client, response) => {
            let connection = message.guild.voiceConnection;
            if (!connection) return response.error(`No connection.`);
            connection.disconnect();
        }
    }*/
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

function process(message, client, response, url) {
    try {
        ytdl.getInfo(url, (error, info) => {
            if (error) return response.error(`An Error Occured:\`${error}\``);
            play(message, client, response, url, info);
        });
    } catch(error) {
        response.error(`An Error Occured:\`${error}\``);
    }
}

function play(message, client, response, video, info) {
    let channel = message.member.voiceChannel;
    if (!channel) return response.error("You are not in a voice channel.");
    channel.join().then(connection => {
        let rawstream = ytdl(video, { audioonly: true });
        let dispatcher = connection.playStream(rawstream, { volume: 0.75, passes: 3 });
        dispatcher.on("start", () => {
            response.send(`🎵 Now playing **${info.title}** requested by **${message.author.username}** for **${client.functions.length(info.length_seconds)}**.`);
        });
        dispatcher.on("error", err => {
            response.send(`An error occured while streaming.`);
            client.log(err, true);
        });
        dispatcher.on("end", () => {
            response.send(`Audio playback completed. Departing from voice channel.`);
            setTimeout(() => connection.disconnect(), 2000);
        });
    });
}
