class Stream {
    constructor(client, connection) {
        Object.defineProperty(this, "client", { value: client });

        this.connection = connection;

        this.mode = null;

        this.lastPlaying = null;

        this.current = null;

        this.dispatcher = null;

        this.volume = .5;

        this.queue = [];
    }

    async play(video) {
        if (video.live) return this.playLivestream(video);

        this.mode = "queue";

        const stream = await video.stream().catch(err => { throw err; });

        this.dispatcher = this.connection.play(stream, { volume: this.volume });
        this.current = video;

        const content = `🎵 Now streaming **${video.title}** requested by **${video.requester.author.username}** for **${this.client.functions.convertTime(video.length * 1000)}**.`;
        this.lastPlaying && video.requester.channel.lastMessageID === this.lastPlaying.id ? this.lastPlaying.edit(content) : video.requester.send(content).then(msg => this.lastPlaying = msg);

        this.dispatcher.on("error", err => {
            video.requester.send(`An error occured playing the video. ${this.queue.length ? "Attempting to play the next video in the queue." : "Leaving the channel."}`);
            if (this.queue.length) setTimeout(() => this.play(this.queue.splice(0, 1)[0]), 1000);
        });

        this.dispatcher.on("end", () => {
            if (this.queue.length) return setTimeout(() => {
                this.play(this.queue[0]);
                this.queue.splice(0, 1);
            }, 1000);

            video.requester.send("The queue has concluded.");
            this.end();
        });
    }

    async playLivestream(video) {
        this.mode = "live";

        const stream = await video.stream().catch(err => { throw err; });

        this.dispatcher = this.connection.play(stream, { volume: .5 });
        this.current = video;

        video.requester.send(`🎵 Now streaming **${video.title}** requested by **${video.requester.author.username}**.`);

        this.dispatcher.on("error", err => {
            video.requester.send(`An error occured while trying to play the livestream. Leaving the channel.`);
            this.end();
        });

        this.dispatcher.on("end", () => {
            video.requester.send("The livestream has concluded.");
            this.end();
        });
    }

    end() {
        this.queue = [];
        this.connection.channel.leave();
        this.client.emit("voiceConnectionUpdate");
    }

    skip() {
        if (!this.dispatcher) this.end();

        const song = this.current;

        this.dispatcher.end();

        return song;
    }

    setVolume(volume) {
        if (!this.dispatcher) this.end();
        
        this.volume = volume;
        return this.dispatcher.setVolume(volume);
    }

    pause() {
        if (!this.dispatcher) this.end();
        
        this.dispatcher.pause();
    }

    resume() {
        if (!this.dispatcher) this.end();
        
        this.dispatcher.resume();
    }

    queue(video, silent = false) {
        if (silent) {
            this.queue.push(video);
        } else {
            this.queue.push(video);

            return video.requester.reply(`Enqueued **${video.title}**.`);
        }
    }
}

module.exports = Stream;
