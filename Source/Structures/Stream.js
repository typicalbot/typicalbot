class Stream {
    constructor(client, connection) {
        this.client = client;
        this.connection = connection;

        this.current = null;

        this.dispatcher = null;

        this.queue = [];
    }

    play(video) {
        this.client.audioUtility.fetchStream(video).then(audioStream => {
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

                setTimeout(() =>
                    this.play(this.queue.splice(0, 1)[0]),
                    1000
                );
            });
        }).catch(err => {
            video.response.error(`An error occured:\n\n${err}`);
        });
    }

    kill() {
        this.queue = [];
        this.connection.disconnect();
        this.client.streams.delete(this.connection.channel.guild);
        this.client.emit("voiceConnectionChange");
    }
}

module.exports = Stream;
