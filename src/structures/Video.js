/* eslint-disable camelcase */
const ytdl = require('ytdl-core');
const SYS = require('simple-youtube-stream');

const sys = new SYS();

class Video {
    constructor(url, { title, length_seconds, live_playback }, requester) {
        this.url = url;

        this.title = title;

        this.length = length_seconds;

        this.live = !!live_playback;

        this.requester = requester;
    }

    async validate(url) {
        const id = /[a-zA-Z0-9-_]{11}$/.exec(url);

        return sys.fetchInfo(id ? id[0] : url);
    }

    async stream() {
        await this.validate(this.url).catch((err) => { throw err; });

        return this.live
            ? ytdl(this.url)
            : ytdl(this.url, { filter: 'audioonly' });
    }
}

module.exports = Video;
