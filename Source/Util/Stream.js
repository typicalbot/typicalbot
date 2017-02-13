const ytdl = require("ytdl-core");

class Stream {
    constructor(client, connection) {
        this.client = client;
        this.connection = connection;

        this.current = null;

        this.dispatcher = null;

        this.queue = [];
    }

    fetchStream(video) {
        return new Promise((resolve, reject) => {
            let audioStream = ytdl(video.url, { filter: "audioonly" });
            return resolve(audioStream);
        });
    }

    play(response, video) {
        this.fetchStream(video).then(audioStream => {
            let dispatcher = this.connection.playStream(audioStream, { volume: 0.5 });
            this.dispatcher = dispatcher;

            this.current = video;

            response.send(`🎵 Now playing **${video.title}** requested by **${response.message.author.username}** for **${this.client.functions.length(video.length_seconds)}**. **Music is enabled for testing purposes. It most likely will be disabled within a few hours.**`);

            dispatcher.on("error", err => {
                response.error(err);
            });

            dispatcher.on("end", () => {
                if (!this.queue.length) {
                    response.send(`The queue has concluded.`);
                    return this.kill();
                }

                let next = this.queue[0];
                this.queue.shift();
                this.play(next.response, next);
            });
        }).catch(err => {
            response.error(`An error occured:\n\n${err}`);
        });
    }

    kill() {
        this.queue = [];
        this.client.streams.delete(this.connection.channel.guild);
        this.connection.disconnect();
        this.client.events.voiceConnectionChange();
    }

    skip() {
        return new Promise((resolve, reject) => {
            let song = this.current;
            this.dispatcher.end();
            return resolve(song);
        });
    }

    pause() {
        return new Promise((resolve, reject) => {
            return resolve(this.dispatcher.pause());
        });
    }

    resume() {
        return new Promise((resolve, reject) => {
            return resolve(this.dispatcher.resume());
        });
    }

    setVolume(vol) {
        return new Promise((resolve, reject) => {
            return resolve(this.dispatcher.setVolume(vol));
        });
    }

    unqueue(id) {
        return new Promise((resolve, reject) => {
            let queueid = id - 1;

            if (!this.queue[queueid]) return reject(`There is no item in the queue under the ID of **${id}**.`);
        });
    }
}

module.exports = Stream;
