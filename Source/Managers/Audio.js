const Stream = require("../Structures/Stream");

class Audio {
    constructor(client) {
        this.client = client;
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

    stream(response, video) {
        return new Promise((resolve, reject) => {
            let currentConnection = response.message.guild.voiceConnection;
            if (currentConnection) return this.queue(response, video);

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

    queue(response, video) {
        let stream = this.client.streams.get(response.message.guild.id);

        video.response = response;
        stream.queue.push(video);

        return response.reply(`Enqueued **${video.title}**.`);
    }
}

module.exports = Audio;
