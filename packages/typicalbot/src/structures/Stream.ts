import Cluster from '..';
import { StreamDispatcher } from 'discord.js';
import Video from './Video';
import { TypicalGuildMessage } from '../types/typicalbot';
import { TypicalGuild } from '../extensions/TypicalGuild';

export default class Stream {
    client: Cluster;
    mode: 'queue' | 'live' | null = null;
    queue: Video[] = [];
    lastPlaying: TypicalGuildMessage | null = null;
    current: Video | null = null;
    dispatcher: StreamDispatcher | null = null;
    volume = 0.5;
    guild: TypicalGuild;

    constructor(client: Cluster, guild: TypicalGuild) {
        this.client = client;
        this.guild = guild;
    }

    async play(message: TypicalGuildMessage, video: Video) {
        if (video.live) return this.playLive(message, video);

        this.mode = 'queue';

        this.dispatcher =
            this.guild.voice && this.guild.voice.connection
                ? this.guild.voice.connection.play(await video.stream(), {
                      volume: this.volume
                  })
                : null;

        this.current = video;

        const convertTime = this.client.functions.get('covertTime');

        const content = message.translate('music/music:STREAMING', {
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
            )) as TypicalGuildMessage;
            this.lastPlaying = response;
        }

        this.dispatcher &&
            this.dispatcher.on('error', err => {
                video.requester.send(
                    message.translate(
                        this.queue.length
                            ? 'music/music:ERROR_PLAYING'
                            : 'music/music:ERROR_LEAVING'
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

        this.dispatcher &&
            this.dispatcher.on('finish', () => {
                if (this.queue.length) {
                    return setTimeout(() => {
                        this.play(message, this.queue[0]);
                        this.queue.splice(0, 1);
                    }, 1000);
                }

                video.requester.send(
                    message.translate('music/music:CONCLUDED')
                );
                return this.end();
            });
    }

    async playLive(message: TypicalGuildMessage, video: Video) {
        this.mode = 'live';

        this.dispatcher =
            this.guild.voice &&
            this.guild.voice.connection &&
            this.guild.voice.connection.play(await video.stream(), {
                volume: this.volume
            });

        this.current = video;

        video.requester.send(
            message.translate('music/music:LIVE_STREAMING', {
                title: video.title,
                user: video.requester.author.username
            })
        );

        this.dispatcher &&
            this.dispatcher.on('error', err => {
                video.requester.send(
                    message.translate('music/music:ERROR_LIVESTREAM')
                );
                // eslint-disable-next-line no-console
                console.log(err);
                this.end();
            });

        this.dispatcher &&
            this.dispatcher.on('finish', () => {
                video.requester.send(
                    message.translate('music/music:LIVE_CONCLUDED')
                );
                this.end();
            });
    }

    end() {
        this.queue = [];
        if (!this.guild.voice || !this.guild.voice.connection) return;
        this.guild.voice.connection.channel.leave();
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

    queueVideo(message: TypicalGuildMessage, video: Video, silent = false) {
        this.queue.push(video);

        if (silent) return;

        video.requester.reply(
            message.translate('music/music:ENQUEUED', { title: video.title })
        );
    }
}
