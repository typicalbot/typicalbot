class Stream {
    constructor(client, connection) {
        this.client = client;

        this.connection = connection;

        this.current = null;

        this.dispatcher = null;

        this.queue = [];
    }

    async play(video) {
        const stream = await this.client.audioUtility.fetchStream(video).catch(err => { throw err; });

        this.dispatcher = this.connection.playStream(stream, { volume: .5 });
        this.current = video;

        video.requester.send(`🎵 Now streaming **${video.title}** requested by **${video.requester.author.username}** for **${this.client.functions.convertTime(video.length_seconds * 1000)}**.`);

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
            this.destroy();
        });
    }

    destroy() {
        this.queue = [];
        this.connection.disconnect();
        this.client.emit("voiceConnectionUpdate");
    }

    skip() {
        const song = this.current;

        this.dispatcher.end();

        return song;
    }

    setVolume(volume) {
        return this.dispatcher.setVolume(volume);
    }

    setQueue(list) {
        this.queue = list;
        return this.queue;
    }
    
    addQueue(video) {
        if (video instanceof Array) {
            video.splice(0, 1);
            video.forEach(v => this.queue.push(v));

            return this.queue;
        } else {
            if (this.queue.length >= (video.requester.guild.settings.queuelimit || 10)) return video.requester.error(`The queue limit of ${video.requester.guild.settings.queuelimit || 10} has been reached.`);

            this.queue.push(video);

            return video.requester.reply(`Enqueued **${video.title}**.`);
        }
    }
}

module.exports = Stream;
