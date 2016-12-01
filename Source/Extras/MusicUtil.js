const ytdl = require("ytdl-core");
const _ = {};

_.startconnection = (client, message, video, info) => {
    let lengthlimit = message.guild.settings.lengthlimit || 1800;
    if (info.length_seconds > lengthlimit) return message.channel.sendMessage(`${message.author} | \`❌\` | That video is too long.`);

    let connection = message.guild.voiceConnection;
    if (!connection) {
        let authorchannel = message.member.voiceChannel;
        if (!authorchannel || !authorchannel.joinable || !authorchannel.speakerable) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in a voice channel or I do not have permissions to enter/speak the voice channel..`);

        authorchannel.join().then(connection => {
            client.streams.set(message.guild.id, {"current": { video, info, message }, "queue": []});
            client.music.play(client, connection, message, video, info);
        }).catch(err => message.channel.sendMessage(`${message.author} | \`❌\` | An error occured joining your voice channel.`));
    } else {
        let authorchannel = message.member.voiceChannel;
        if (!authorchannel || authorchannel.id !== connection.channel.id) return message.channel.sendMessage(`${message.author} | \`❌\` | You're not in the same voice channel as I am.`);

        if (!client.streams.has(message.guild.id)) return;
        let stream = client.streams.get(message.guild.id);

        let limit = message.guild.settings.queuelimit || 20;
        if (stream.queue.length >= limit) return message.channel.sendMessage(`${message.author} | \`❌\` | The queue limit of ${limit} has been reached.`);
        stream.queue.push({ video, info, message });
        message.channel.sendMessage(`Enqueued **${info.title}**.`);
    }
};

_.play = (client, connection, message, video, info) => {
    let stream = client.streams.get(message.guild.id);
    stream.current = { video, info, message };

    let rawstream = ytdl(video, {audioonly: true});
    let dispatcher = connection.playStream(rawstream, {volume: 0.75, passes: 3});
    dispatcher.on("start", () => {
        message.channel.sendMessage(`🎵 Now playing **${info.title}** requested by **${message.author.username}** for **${client.functions.length(info.length_seconds)}**.`);
    });
    dispatcher.on("error", err => {
        message.channel.sendMessage(`An error occured while streaming.`);
        dispatcher.end();
    });
    dispatcher.on("end", () => {
        let next = stream.queue[0];
        if (next) {
            client.music.play(client, connection, next.message, next.video, next.info);
            stream.queue.shift();
        } else {
            message.channel.sendMessage(`Finished playing audio. Departing from voice channel.`);
            connection.disconnect();
            client.streams.delete(message.guild.id);
        }
    });
};


module.exports = _;
