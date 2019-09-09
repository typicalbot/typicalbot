const Stream = require('../structures/Stream');

function shuffle(arr) {
    for (let i = arr.length; i; i--) {
        const j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }

    return arr;
}

module.exports = class {
    constructor(client) {
        Object.defineProperty(this, 'client', { value: client });
    }

    async connect(message) {
        const { channel } = message.member.voice;

        if (!channel) throw 'Please join a voice channel to use this command.';
        if (!channel.joinable) throw 'I cannot join the voice channel you are in.';
        if (!channel.speakable) throw 'I cannot speak in the voice channel you are in.';

        const connection = await channel.join().catch((err) => { throw err; });

        this.client.emit('voiceConnectionUpdate', connection);

        return connection;
    }

    async initStream(message, video, playlist) {
        const connection = await this.connect(message).catch((err) => { throw err; });

        if (playlist) {
            return connection.guildStream.play(
                await this.queuePlaylist(message, video, connection.guildStream).catch((err) => { throw err; }),
            ).catch((err) => { throw err; });
        }

        connection.guildStream.play(video).catch((err) => { throw err; });
    }

    async stream(message, video, playlist = false) {
        if (!playlist && !this.client.utility.music.withinLimit(message, video)) throw `The video you are trying to play is too long. The maximum video length is ${this.client.functions.convertTime(message.guild.settings.music.timelimit * 1000 || 1800 * 1000)}.`;

        const { voice } = message.guild;

        if (!voice) return this.initStream(message, video, playlist);

        const { connection } = message.guild.voice;

        if (!connection) return this.initStream(message, video, playlist);

        if (connection.guildStream.mode && connection.guildStream.mode !== 'queue') throw 'You can only add to the queue while in queue mode.';

        if (!message.member.voice.channel || message.member.voice.channel.id !== connection.channel.id) throw 'You must be in the same voice channel to request a video to be played.';
        if (connection.guildStream.queue.length >= (message.guild.settings.music.queuelimit || 10)) return message.error(`The queue limit of ${message.guild.settings.music.queuelimit || 10} has been reached.`);

        if (playlist) return this.queuePlaylist(message, video, connection.guildStream).catch((err) => { throw err; });

        return connection.guildStream.queueVideo(video);
    }

    async queuePlaylist(message, id, guildStream) {
        message.reply('Loading the playlist into the queue. This may take a while.');

        const playlist = await this.client.utility.music.fetchPlaylist(message, id).catch((err) => { throw err; });

        const shuffledPlaylist = shuffle(playlist);
        shuffledPlaylist.splice(101, Infinity);

        const firstVideo = await this.client.utility.music.fetchInfo(shuffledPlaylist[0].url, message).catch((err) => { throw err; });

        shuffledPlaylist.forEach(async (v) => {
            const video = await this.client.utility.music.fetchInfo(v.url, message).catch((err) => { });
            if (!video) return;

            if (!this.client.utility.music.withinLimit(message, video)) return;

            guildStream.queueVideo(video, true);
        });

        return firstVideo;
    }
};
