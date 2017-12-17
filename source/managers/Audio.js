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

            if (playlist) return this.queuePlaylist(message, video, message.guild.voiceConnection.guildStream).catch(err => { throw err; });
            return message.guild.voiceConnection.guildStream.addQueue(video);
        }

        const playlistQueue = playlist ? await this.playlist(message, video).catch(err => { throw err; }) : null;

        const connection = await this.connect(message).catch(err => { throw err; });

        if (playlist) connection.guildStream.setQueue(playlistQueue);

        playlist ?
            connection.guildStream.play(playlistQueue[0]).catch(err => { throw err; }) :
            connection.guildStream.play(video).catch(err => { throw err; });
    }

    async startPlaylist(message, id, guildStream) {
        message.reply(`Loading the playlist into the queue. This may take a couple of seconds.`);

        const playlist = await this.client.audioUtility.fetchPlaylist(message, id).catch(err => { throw err; });

        const first = playlist[0];

        const queue = playlist.map(async video => { const v = await this.client.audioUtility.fetchInfo(video.url).catch(err => { console.log(err); }); Object.defineProperty(v, "requester", { value: message }); return v; })
            .filter(v => this.client.audioUtility.withinLimit(message, v));

        return first;
    }

    async queuePlaylist(message, id, guildStream) {
        message.reply(`Loading the playlist into the queue. This may take a couple of seconds.`);

        const playlist = await this.client.audioUtility.fetchPlaylist(message, id).catch(err => { throw err; });

        playlist.forEach(async v => {
            const video = await this.client.audioUtility.fetchInfo(v.url).catch(err => { return; });

            if (!this.client.audioUtility.withinLimit(message, video)) return;

            Object.defineProperty(video, "requester", { value: message });

            guildStream.addQueue(video, true);
        });
    }
};
