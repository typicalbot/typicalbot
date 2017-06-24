const Stream = require("../Structures/Stream");

class Audio {
    constructor(client) {
        this.client = client;
    }

    connect(response) {
        return new Promise((resolve, reject) => {
            const memberConnection = response.message.member.voiceChannel;
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
            if (!this.client.audioUtility.withinLimit(video, response)) return response.error(`The song requested is too long to play. The maximum song length is ${this.client.functions.length(response.message.guild.settings.lengthLimit || 1800)}.`);

            const currentConnection = response.message.guild.voiceConnection;
            if (currentConnection) {
                if (!response.message.member.voiceChannel || response.message.member.voiceChannel.id !== currentConnection.channel.id) return response.error("You must be in the same voice channel to request a song to be played.");
                return this.queue(response, video);
            }

            this.connect(response).then(connection => {
                const guildStream = new Stream(this.client, connection);
                this.client.streams.set(response.message.guild.id, guildStream);

                video.response = response;
                guildStream.play(video);
            }).catch(err => {
                return response.error(err);
            });
        });
    }

    queue(response, video) {
        const stream = this.client.streams.get(response.message.guild.id);

        if (stream.queue.length >= (response.message.guild.settings.queuelimit || 10)) return response.error(`The queue limit of ${response.message.guild.settings.queuelimit || 10} has been reached.`);

        video.response = response;
        stream.queue.push(video);

        return response.reply(`Enqueued **${video.title}**.`);
    }
}

module.exports = Audio;
