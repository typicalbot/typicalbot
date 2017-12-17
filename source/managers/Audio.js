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

        channel.join().then(connection => {
            this.client.emit("voiceConnectionUpdate", connection);

            Object.defineProperty(connection, "guildStream", { value: new Stream(this.client, connection) });

            return connection;
        }).catch(err => { throw err; });
    }

    async stream(message, video) {
        if (!this.client.audioUtility.withinLimit(message, video)) throw `The video you are trying to play is too long. The maximum video length is ${this.client.functions.convertTime(this.client.functions.length(message.guild.settings.lengthLimit * 1000 || 1800 * 1000))}.`;

        Object.defineProperty(video, "requestor", { value: message });

        let connection = message.guild.voiceConnection;
        
        if (connection) {
            if (!message.member.voiceChannel || message.member.voiceChannel.id !== connection.channel.id) throw "You must be in the same voice channel to request a video to be played.";
            return connection.guildStream.queue(video);
        }

        connection = await this.connect(message).catch(err => { throw err; });

        connection.guildStream.play(video);
    }

    queue(message, video) {
        const stream = this.client.streams.get(message.guild.id);

        if (stream.queue.length >= (message.guild.settings.queuelimit || 10)) return message.error(`The queue limit of ${message.guild.settings.queuelimit || 10} has been reached.`);

        video.message = message;
        stream.queue.push(video);

        return message.reply(`Enqueued **${video.title}**.`);
    }
};
