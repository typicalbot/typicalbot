const Stream = require("../structures/Stream");

module.exports = class {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    async connect(message) {
        const channel = message.member.voiceChannel;

        if (!channel) throw "You must be connected to a voice channel to use music features.";
        if (!channel.joinable) throw "I require joining permissions to use music features.";
        if (!channel.speakable) throw "I require speaking permissions to use music features.";

        const connection = await channel.join().catch(err => { throw err; });

        this.client.emit("voiceConnectionUpdate", connection);

        return connection;
    }

    async stream(message, video, playlist = false) {
        if (!playlist) if (!this.client.utility.music.withinLimit(message, video)) throw `The video you are trying to play is too long. The maximum video length is ${this.client.functions.convertTime(message.guild.settings.music.timelimit * 1000 || 1800 * 1000)}.`;

        const currConnection = message.guild.voiceConnection;

        if (currConnection) {
            if (currConnection.guildStream.mode !== "queue") throw "You can only add to the queue while in queue mode.";

            if (!message.member.voiceChannel || message.member.voiceChannel.id !== currConnection.channel.id) throw "You must be in the same voice channel to request a video to be played.";
            if (currConnection.guildStream.queue.length >= (video.requester.guild.settings.music.queuelimit || 10)) return video.requester.error(`The queue limit of ${video.requester.guild.settings.music.queuelimit || 10} has been reached.`);

            if (playlist) return this.queuePlaylist(message, video, currConnection.guildStream).catch(err => { throw err; });
            return currConnection.guildStream.addQueue(video);
        }

        const connection = await this.connect(message).catch(err => { throw err; });

        const playlistFirst = playlist ? await this.startPlaylist(message, video, connection.guildStream).catch(err => { throw err; }) : null;

        playlist ?
            connection.guildStream.play(playlistFirst).catch(err => { throw err; }) :
            connection.guildStream.play(video).catch(err => { throw err; });
    }

    shuffle(arr) {
        for (let i = arr.length; i; i--) {
            const j = Math.floor(Math.random() * i);
            [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
        }
        return arr;
    }

    async startPlaylist(message, id, guildStream) {
        message.reply(`Loading the playlist into the queue. This may take a while.`);

        const playlist = this.shuffle(await this.client.utility.music.fetchPlaylist(message, id).catch(err => { throw err; }));
        playlist.splice(101, Infinity);

        const first = await this.client.utility.music.fetchInfo(playlist[0].url).catch(err => { return; });
        Object.defineProperty(first, "requester", { value: message });

        playlist.forEach(async v => {
            const video = await this.client.utility.music.fetchInfo(v.url, message).catch(err => { return; });
            if (!video) return;

            if (!this.client.utility.music.withinLimit(message, video)) return;

            guildStream.addQueue(video, true);
        });

        return first;
    }

    async queuePlaylist(message, id, guildStream) {
        message.reply(`Loading the playlist into the queue. This may take a while.`);

        const playlist = this.shuffle(await this.client.utility.music.fetchPlaylist(message, id).catch(err => { throw err; }));
        playlist.splice(101, Infinity);

        playlist.forEach(async v => {
            const video = await this.client.utility.music.fetchInfo(v.url, message).catch(err => { return; });
            if (!video) return;

            if (!this.client.utility.music.withinLimit(message, video)) return;

            video.setRequester(message);

            guildStream.addQueue(video, true);
        });
    }
};
