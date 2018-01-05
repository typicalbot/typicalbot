const ytdl = require("ytdl-core");
const SYS = require("simple-youtube-stream");
const sys = new SYS();

class Video {
    constructor(url, { title, length_seconds, live_playback }, requester) {
        this.url = url;

        this.title = title;

        this.length = length_seconds;

        this.live = !!live_playback;

        this.requestor = requester;
    }

    async validate(url) {
        const id = /[a-zA-Z0-9-_]{11}$/.exec(url);
        if (id) url = id;
        
        const data = sys.fetchInfo(url).catch(err => { throw err; });
        return data;
    }

    async stream() {
        const validated = await this.validate(this.url).catch(err => { throw err; });

        const options = {};
        if (!this.live_playback) Object.assign(options, { filter: "audioonly"});
            
        const audioStream = ytdl(this.url, options);
        return audioStream;
    }
}

module.exports = Video;