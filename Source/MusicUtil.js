const ytdl = require("ytdl-core");

class MusicUtil {
    constructor(client) {
        this.client = client;
    }

    ProcessVideo(message, video) {
        try {
            ytdl.getInfo(video, (error, info) => {
                if (error) return message.channel.sendMessage(`${message.author} | \`❌\` | An Error Occured:\n\n${error.stack}`);
                this.client.MusicUtil.BeginAudio(message, video, info);
            });
        } catch(error) {
            message.channel.sendMessage(`${message.author} | \`❌\` | An Error Occured:\n\n${error.stack}`);
        }
    }

    BeginAudio(message, video, info) {
        let lengthlimit = message.guild.settings.lengthlimit || 1800;
        if (info.length_seconds > lengthlimit) return message.channel.sendMessage(`${message.author} | \`❌\` | That video is too long.`);

        let connection = message.guild.voiceConnection;
        if (!connection) {
            let authorchannel = message.member.voiceChannel;
            if (!authorchannel) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in a voice channel.`);
            if (!authorchannel.joinable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot connect to your channel.`);
            if (!authorchannel.speakable) return message.channel.sendMessage(`${message.author} | \`❌\` | I cannot speak in your channel.`);
            authorchannel.join().then(connection => {
                this.client.streams.set(message.guild.id, {"current": { video, info, message }, "queue": []});
                this.client.MusicUtil.PlayAudio(connection, message, video, info);
            }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured joining your voice channel.`));
        } else {
            let authorchannel = message.member.voiceChannel;
            if (!authorchannel) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in a voice channel.`);
            if (authorchannel.id !== connection.channel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);
            let stream = this.client.streams.get(message.guild.id);
            if (!stream) return;
            let queue = stream.queue;
            let queuelimit = message.guild.settings.queuelimit || 20;
            if (queue.length >= queuelimit) return message.channel.sendMessage(`${message.author} | \`❌\` | The queue limit of ${queuelimit} has been reached.`);
            queue.push({ video, info, message });
            message.channel.sendMessage(`Enqueued **${info.title}**.`);
        }
    }

    PlayNext(connection, stream, message, video, info) {
        let next = stream.queue[0];
        if (next) {
            this.client.MusicUtil.PlayAudio(connection, next.message, next.video, next.info);
            stream.queue.shift();
        } else {
            message.channel.sendMessage(`Finished playing audio. Departing from voice channel.`);
            connection.disconnect();
        }
    }

    PlayAudio(connection, message, video, info) {
        let stream = this.client.streams.get(message.guild.id);
        stream.current = { video, info, message };
        let rawstream = ytdl(video, {audioonly: true});
        let dispatcher = connection.playStream(rawstream, {volume: 0.75, passes: 3});
        dispatcher.on("start", () => {
            message.channel.sendMessage(`🎵 Now playing **${info.title}** requested by **${message.author.username}** for **${this.client.functions.length(info.length_seconds)}**.`);
        });
        dispatcher.on("error", err => {
            message.channel.sendMessage(`An error occured while streaming.`);
            dispatcher.end();
        });
        dispatcher.on("end", () => {
            this.client.MusicUtil.PlayNext(connection, stream, message, video, info);
        });
    }
}

module.exports = MusicUtil;
