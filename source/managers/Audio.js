const Stream = require("../structures/Stream");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    connect(message) {
        return new Promise((resolve, reject) => {
            const memberConnection = message.member.voiceChannel;
            if (!memberConnection) return reject("You do not seem to be connected to a voice channel. Please join one.");
            if (!memberConnection.joinable) return reject("I cannot connect to the voice channel you're currently in.");
            if (!memberConnection.speakable) return reject("I cannot speak in the voice channel you're currently in.");

            memberConnection.join().then(connection => {
                this.client.emit("voiceConnectionChange");
                return resolve(connection);
            }).catch(err => {
                return reject("An error occured while connecting to your voice channel.\n\n" + err);
            });
        });
    }

    stream(message, video) {
        return new Promise((resolve, reject) => {
            if (!this.client.audioUtility.withinLimit(video, message)) return message.error(`The song requested is too long to play. The maximum song length is ${this.client.functions.length(message.guild.settings.lengthLimit || 1800)}.`);

            const currentConnection = message.guild.voiceConnection;
            if (currentConnection) {
                if (!message.member.voiceChannel || message.member.voiceChannel.id !== currentConnection.channel.id) return message.error("You must be in the same voice channel to request a song to be played.");
                return this.queue(message, video);
            }

            this.connect(message).then(connection => {
                const guildStream = new Stream(this.client, connection);
                this.client.streams.set(message.guild.id, guildStream);

                video.message = message;
                guildStream.play(video);
            }).catch(err => {
                return message.error(err);
            });
        });
    }

    queue(message, video) {
        const stream = this.client.streams.get(message.guild.id);

        if (stream.queue.length >= (message.guild.settings.queuelimit || 10)) return message.error(`The queue limit of ${message.guild.settings.queuelimit || 10} has been reached.`);

        video.message = message;
        stream.queue.push(video);

        return message.reply(`Enqueued **${video.title}**.`);
    }
};
