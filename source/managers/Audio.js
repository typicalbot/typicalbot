const Stream = require("../structures/Stream");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async connect(message) {
        const channel = message.member.voiceChannel;

        if (!channel) throw "You must be connected to a voice channel to use music features.";
        if (!channel.joinable) throw "I require joining permissions to use music features.";
        if (!channel.speakable) throw "I require speaking permissions to use music features.";

        const connection = await channel.join().catch(err => { throw err; });

        this.client.emit("voiceConnectionUpdate", connection);

        Object.defineProperty(connection, "guildStream", { value: new Stream(this.client, connection) });

        return connection;
    }

    async stream(message, video, playlist = false) {
        if (!playlist) {
            if (!this.client.audioUtility.withinLimit(message, video)) throw `The video you are trying to play is too long. The maximum video length is ${this.client.functions.convertTime(message.guild.settings.music.timelimit * 1000 || 1800 * 1000)}.`;

            Object.defineProperty(video, "requester", { value: message });
        }

        if (message.guild.voiceConnection) {
            if (!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.voiceConnection.channel.id) throw "You must be in the same voice channel to request a video to be played.";
            if (this.queue.length >= (video.requester.guild.settings.music.queuelimit || 10)) return video.requester.error(`The queue limit of ${video.requester.guild.settings.music.queuelimit || 10} has been reached.`);

            if (playlist) return this.queuePlaylist(message, video, message.guild.voiceConnection.guildStream).catch(err => { throw err; });
            return message.guild.voiceConnection.guildStream.addQueue(video);
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

        const playlist = this.shuffle(await this.client.audioUtility.fetchPlaylist(message, id).catch(err => { throw err; }));
        playlist.splice(100, Infinity);

        const first = await this.client.audioUtility.fetchInfo(playlist[0].url).catch(err => { return; });
        Object.defineProperty(first, "requester", { value: message });

        playlist.forEach(async v => {
            const video = await this.client.audioUtility.fetchInfo(v.url).catch(err => { return; });
            if (!video) return;

            if (!this.client.audioUtility.withinLimit(message, video)) return;

            Object.defineProperty(video, "requester", { value: message });

            guildStream.addQueue(video, true);
        });

        return first;
    }

    async queuePlaylist(message, id, guildStream) {
        message.reply(`Loading the playlist into the queue. This may take a while.`);

        const playlist = this.shuffle(await this.client.audioUtility.fetchPlaylist(message, id).catch(err => { throw err; }));
        playlist.splice(100, Infinity);

        playlist.forEach(async v => {
            const video = await this.client.audioUtility.fetchInfo(v.url).catch(err => { return; });
            if (!video) return;

            if (!this.client.audioUtility.withinLimit(message, video)) return;

            Object.defineProperty(video, "requester", { value: message });

            guildStream.addQueue(video, true);
        });
    }
};
