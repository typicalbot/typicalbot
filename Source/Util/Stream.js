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

    play(video) {
        this.fetchStream(video).then(audioStream => {
            let dispatcher = this.connection.playStream(audioStream, { volume: 0.5 });
            this.dispatcher = dispatcher;

            this.current = video;

            video.response.send(`🎵 Now playing **${video.title}** requested by **${video.response.message.author.username}** for **${this.client.functions.length(video.length_seconds)}**.`);

            dispatcher.on("error", err => {
                video.response.error(err);
            });

            dispatcher.on("end", () => {
                if (!this.queue.length) {
                    video.response.send(`The queue has concluded.`);
                    return this.kill();
                }

                dispatcher.stream.destroy();
                this.play(this.queue.splice(0, 1)[0]);
            });
        }).catch(err => {
            video.response.error(`An error occured:\n\n${err}`);
        });
    }

    kill() {
        this.queue = [];
        this.client.streams.delete(this.connection.channel.guild);
        this.connection.disconnect();
        this.client.events.voiceConnectionChange();
    }

    skip() {
        let song = this.current;
        this.dispatcher.end();
        return song;
    }

    pause() {
        return this.dispatcher.pause();
    }

    resume() {
        return this.dispatcher.resume();
    }

    setVolume(vol) {
        return this.dispatcher.setVolume(vol);
    }

    unqueue(id) {
        return new Promise((resolve, reject) => {
            let queueid = id - 1;

            if (!this.queue[queueid]) return reject(`There is no item in the queue under the ID of **${id}**.`);
        });
    }
}

module.exports = Stream;
