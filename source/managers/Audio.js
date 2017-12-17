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
        if (playlist) {
            if (!this.client.audioUtility.withinLimit(message, video)) throw `The video you are trying to play is too long. The maximum video length is ${this.client.functions.convertTime(message.guild.settings.lengthLimit * 1000 || 1800 * 1000)}.`;

            Object.defineProperty(video, "requester", { value: message });
        }

        const playlistQueue = playlist ? this.playlist(message, video) : null;

        if (message.guild.voiceConnection) {
            if (!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.voiceConnection.channel.id) throw "You must be in the same voice channel to request a video to be played.";
            
            if (!playlist) return message.guild.voiceConnection.guildStream.addQueue(video);
            playlistQueue.forEach(v => message.guild.voiceConnection.guildStream.queue.push(v));
        }

        const connection = await this.connect(message).catch(err => { throw err; });

        connection.guildStream.queue = playlistQueue;

        playlist ? 
            connection.guildStream.play(playlistQueue[0]).catch(err => { throw err; }) :
            connection.guildStream.play(video).catch(err => { throw err; });
    }

    async playlist(message, id) {
        const queue = this.client.audioUtility.fetchPlaylist(message, id).catch(err => { throw err; });

        queue.filter(v => this.client.audioUtility.withinLimit(message, v));
        queue.forEach(v => Object.defineProperty(v, "requester", { value: message }));

        return queue;
    }
};
