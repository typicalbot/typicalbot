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
            const dispatcher = this.connection.playStream(audioStream, { volume: 0.5 });

            this.dispatcher = dispatcher;
            this.current = video;

            video.message.send(`🎵 Now streaming **${video.title}** requested by **${video.response.message.author.username}** for **${this.client.functions.convertTime(video.length_seconds * 1000)}**.`);

            dispatcher.on("error", err => {
                video.message.error(err);
            });

            dispatcher.on("end", () => {
                if (!this.queue.length) {
                    video.message.send(`The queue has concluded.`);
                    return this.kill();
                }

                setTimeout(() =>
                    this.play(this.queue.splice(0, 1)[0]),
                    1000
                );
            });
        }).catch(err => {
            video.message.error(`An error occured fetching information for the requested song.${video.response.message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`);
        });
    }

    kill() {
        this.queue = [];
        this.connection.disconnect();
        this.client.streams.delete(this.connection.channel.guild);
        this.client.emit("voiceConnectionChange");
    }

    skip() {
        const song = this.current;
        this.dispatcher.end();
        return song;
    }

    setVolume(vol) {
        return this.dispatcher.setVolume(vol);
    }
}

module.exports = Stream;
