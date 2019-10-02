import Cluster from '..';
import { VoiceConnection, StreamDispatcher } from 'discord.js';
import Video from './Video';
import { GuildMessage } from '../types/typicalbot';

export default class Stream {
    client: Cluster;
    connection: VoiceConnection;
    mode: 'queue' | 'live' | null = null;
    queue: Video[] = [];
    lastPlaying: GuildMessage | null = null;
    current: Video | null = null;
    dispatcher: StreamDispatcher | null = null;
    volume = 0.5;

    constructor(client: Cluster, connection: VoiceConnection) {
        this.client = client;
        this.connection = connection;
    }

    async play(message: GuildMessage, video: Video) {
        if (video.live) return this.playLive(message, video);

        this.mode = 'queue';

        this.dispatcher = this.connection.play(
            await video.stream().catch(err => {
                throw err;
            }),
            { volume: this.volume }
        );

        this.current = video;

        const convertTime = this.client.functions.get('covertTime');

        const content = message.translate('music:STREAMING', {
            title: video.title,
            user: video.requester.author.username,
            time:
                convertTime &&
                convertTime.execute(parseInt(video.length, 10) * 1000)
        });

        if (
            this.lastPlaying &&
            video.requester.channel.lastMessageID === this.lastPlaying.id
        )
            this.lastPlaying.edit(content);
        else {
            const response = (await video.requester.send(
                content
            )) as GuildMessage;
            this.lastPlaying = response;
        }

        this.dispatcher.on('error', err => {
            video.requester.send(
                message.translate(
                    this.queue.length
                        ? 'music:ERROR_PLAYING'
                        : 'music:ERROR_LEAVING'
                )
            );
            // eslint-disable-next-line no-console
            console.log(err);
            if (this.queue.length)
                setTimeout(
                    () => this.play(message, this.queue.splice(0, 1)[0]),
                    1000
                );
        });

        this.dispatcher.on('finish', () => {
            if (this.queue.length) {
                return setTimeout(() => {
                    this.play(message, this.queue[0]);
                    this.queue.splice(0, 1);
                }, 1000);
            }

            video.requester.send(message.translate('music:CONCLUDED'));
            return this.end();
        });
    }

    async playLive(message: GuildMessage, video: Video) {
        this.mode = 'live';

        this.dispatcher = this.connection.play(
            await video.stream().catch(err => {
                throw err;
            }),
            { volume: this.volume }
        );

        this.current = video;

        video.requester.send(
            message.translate('music:LIVE_STREAMING', {
                title: video.title,
                user: video.requester.author.username
            })
        );

        this.dispatcher.on('error', err => {
            video.requester.send(message.translate('music:ERROR_LIVESTREAM'));
            // eslint-disable-next-line no-console
            console.log(err);
            this.end();
        });

        this.dispatcher.on('finish', () => {
            video.requester.send(message.translate('music:LIVE_CONCLUDED'));
            this.end();
        });
    }

    end() {
        this.queue = [];
        this.connection.channel.leave();
        this.client.emit('voiceConnectionUpdate');
    }

    skip() {
        if (!this.dispatcher) return this.end();

        const song = this.current;

        this.dispatcher.end();

        return song;
    }

    setVolume(volume: number) {
        if (!this.dispatcher) return this.end();

        this.volume = volume;
        return this.dispatcher.setVolume(volume);
    }

    pause() {
        if (!this.dispatcher) return this.end();
        this.dispatcher.pause();
    }

    resume() {
        if (!this.dispatcher) return this.end();
        this.dispatcher.resume();
    }

    queueVideo(message: GuildMessage, video: Video, silent = false) {
        this.queue.push(video);

        if (silent) return;

        video.requester.reply(
            message.translate('mustic:ENQUEUED', { title: video.title })
        );
    }
}
