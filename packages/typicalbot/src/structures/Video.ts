import * as ytdl from 'ytdl-core';
import * as SYS from 'simple-youtube-stream';
import { GuildMessage } from '../types/typicalbot';

const sys = new SYS();

export default class Video {
    url: string;
    title: string;
    length: string;
    live = false;
    requester: GuildMessage;

    constructor(url: string, info: ytdl.videoInfo, message: GuildMessage) {
        this.url = url;
        this.title = info.title;
        this.length = info.length_seconds;
        // TODO: Figure out what the new property for this is now
        // this.live = !!info.live_playback;
        this.requester = message;
    }

    async validate(url: string) {
        const id = /[a-zA-Z0-9-_]{11}$/.exec(url);

        return sys.fetchInfo(id ? id[0] : url);
    }

    async stream() {
        await this.validate(this.url);

        return this.live
            ? ytdl(this.url)
            : ytdl(this.url, { filter: 'audioonly' });
    }
}
