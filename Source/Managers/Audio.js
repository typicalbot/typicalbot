const Stream = require("../Structures/Stream");
const ytdl = require("ytdl-core");

class Audio {
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

    connect(response) {
        return new Promise((resolve, reject) => {
            let memberConnection = response.message.member.voiceChannel;
            if (!memberConnection) return reject("You do not seem to be connected to a voice channel. Please join one.");
            if (!memberConnection.joinable) return reject("I cannot connect to the voice channel you're currently in.");
            if (!memberConnection.speakable) return reject("I cannot speak in the voice channel you're currently in.");

            memberConnection.join().then(connection => {
                this.client.emit("voiceConnectionChange");
                return resolve(connection);
            }).catch(err => {
                return reject("An error occured while connecting to your voice channel.");
            });
        });
    }

    createStream(response, video) {
        return new Promise((resolve, reject) => {
            let currentConnection = response.message.guild.voiceConnection;
            if (currentConnection) return this.queueVideo(response, video);

            this.connect(response).then(connection => {
                let guildStream = new Stream(this.client, connection);
                this.client.streams.set(response.message.guild.id, guildStream);

                video.response = response;
                guildStream.play(video);
            }).catch(err => {
                return response.error(err);
            });
        });
    }
}

module.exports = Audio;
