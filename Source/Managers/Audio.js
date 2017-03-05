const ytdl = require("ytdl-core");
const Stream = require("../Util/Stream");

class AudioManager {
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

    withinLength(video, settings) {
        let max = settings.lengthLimit || 1800;
        if (video.length_seconds <= max) return true;
        return false;
    }

    playVideo(response, video) {
        return new Promise((resolve, reject) => {
            let conn = response.message.guild.voiceConnection;
            if (conn) return this.addVideo(response, video);
            this.initConnection(response).then(connection => {
                let stream = new Stream(this.client, connection);
                this.client.streams.set(response.message.guild.id, stream);

                video.response = response;
                stream.play(response, video);
            }).catch(err => {
                return response.error(err);
            });
        });
    }

    initConnection(response) {
        return new Promise((resolve, reject) => {
            let memberConnection = response.message.member.voiceChannel;
            if (!memberConnection) return reject("You do not seem to be connected to a voice channel. Please join one.");
            if (!memberConnection.joinable) return reject("I cannot connect to the voice channel you're currently in.");
            if (!memberConnection.speakable) return reject("I cannot speak in the voice channel you're currently in.");

            memberConnection.join().then(connection => {
                this.client.events.voiceConnectionChange();
                return resolve(connection);
            }).catch(err => {
                return reject("An error occured while connecting to your voice channel.");
            });
        });
    }

    addVideo(response, video) {
        let stream = this.client.streams.get(response.message.guild.id);
        if (!stream) return response.error("An error occured.");

        video.response = response;

        stream.queue.push(video);
        return response.reply(`Enqueued **${video.title}**.`);
    }
}

module.exports = AudioManager;
