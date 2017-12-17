class Stream {
    constructor(client, connection) {
        this.client = client;

        this.connection = connection;

        this.current = null;

        this.dispatcher = null;

        this.queue = [];
    }

    async play(video) {
        const stream = await this.client.audioUtility.fetchStream(video);

        this.dispatcher = this.connection.playStream(stream, { volume: .5 });
        this.current = video;

        video.requester.send(`🎵 Now streaming **${video.title}** requested by **${video.message.author.username}** for **${this.client.functions.convertTime(video.length_seconds * 1000)}**.`);

        this.dispatcher.on("error", err => {
            video.requester.send(`An error occured playing the video. ${this.queue.length ? "Attempting to play the next video in the queue." : "Leaving the channel."}`);
            if (this.queue.length) setTimeout(() => this.play(this.queue.splice(0, 1)[0]), 1000);
        });

        this.dispatcher.on("end", () => {
            if (this.queue.length) return setTimeout(() => this.play(this.queue.splice(0, 1)[0]), 1000);

            video.requester.send("The queue has concluded.");
            this.end();
        });
    }

    kill() {
        this.queue = [];
        this.connection.disconnect();
        this.client.emit("voiceConnectionChange");
    }

    skip() {
        const song = this.current;
        this.dispatcher.end();
        return song;
    }

    setVolume(volume) {
        return this.dispatcher.setVolume(volume);
    }
}

module.exports = Stream;
