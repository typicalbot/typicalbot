import Stream from '../structures/Stream';
import { VoiceConnection } from 'discord.js';
import Cluster from '..';
import { GuildMessage } from '../types/typicalbot';
import TypicalFunction from '../structures/Function';
import Video from '../structures/Video';
import { YoutubeVideo } from 'simple-youtube-api';

function shuffle(arr: YoutubeVideo[], maximum?: number) {
    for (let i = arr.length; i; i--) {
        const j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }

    return maximum ? arr.slice(0, maximum) : arr;
}

export default class {
    client: Cluster;

    constructor(client: Cluster) {
        this.client = client;
    }

    async connect(message: GuildMessage) {
        const { channel } = message.member.voice;

        if (!channel) throw message.translate('music:NEED_CHANNEL');
        if (!channel.joinable) throw message.translate('music:NOT_JOINABLE');
        if (!channel.speakable) throw message.translate('music:NOT_SPEAKABLE');

        const connection = await channel.join();

        this.client.emit('voiceConnectionUpdate', connection);

        return connection;
    }

    async initStream(
        message: GuildMessage,
        video: string | Video,
        playlist: boolean
    ) {
        const connection = (await this.connect(message)) as VoiceConnection;

        return playlist
            ? connection.guildStream.play(
                  message,
                  await this.queuePlaylist(
                      message,
                      video as string,
                      connection.guildStream
                  )
              )
            : connection.guildStream.play(message, video as Video);
    }

    async stream(
        message: GuildMessage,
        video: string | Video,
        playlist = false
    ) {
        if (
            !playlist &&
            !this.client.utility.music.withinLimit(message, video as Video)
        ) {
            const convertTime = this.client.functions.get(
                'convertTime'
            ) as TypicalFunction;
            throw message.translate('music:TOO_LONG', {
                time: convertTime.execute(
                    message,
                    message.guild.settings.music.timelimit
                        ? message.guild.settings.music.timelimit * 1000
                        : 1800 * 1000
                )
            });
        }

        if (!message.guild.voice)
            return this.initStream(message, video, playlist);

        const { connection } = message.guild.voice;

        if (!connection) return this.initStream(message, video, playlist);

        if (
            connection.guildStream.mode &&
            connection.guildStream.mode !== 'queue'
        )
            throw message.translate('music:NOT_IN_QUEUE');

        if (
            !message.member.voice.channel ||
            message.member.voice.channel.id !== connection.channel.id
        )
            throw message.translate('music:INVALID_CHANNEL');
        if (
            connection.guildStream.queue.length >=
            (message.guild.settings.music.queuelimit || 10)
        )
            return message.error(
                message.translate('music:QUEUE_MAXED', {
                    amount: message.guild.settings.music.queuelimit || 10
                })
            );

        if (playlist)
            return this.queuePlaylist(
                message,
                video as string,
                connection.guildStream
            );

        return connection.guildStream.queueVideo(message, video as Video);
    }

    async queuePlaylist(
        message: GuildMessage,
        id: string,
        guildStream: Stream
    ) {
        message.reply(message.translate('music:LOADING'));

        const playlist = await this.client.utility.music.fetchPlaylist(
            message,
            id
        );

        const shuffledPlaylist = shuffle(playlist, 100);

        const firstVideo = await this.client.utility.music.fetchInfo(
            shuffledPlaylist[0].url,
            message
        );

        shuffledPlaylist.forEach(async v => {
            const video = await this.client.utility.music
                .fetchInfo(v.url, message)
                .catch(() => null);
            if (!video) return;

            if (!this.client.utility.music.withinLimit(message, video)) return;

            guildStream.queueVideo(message, video, true);
        });

        return firstVideo;
    }
}
