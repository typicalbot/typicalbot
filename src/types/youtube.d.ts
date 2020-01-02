declare module 'simple-youtube-api' {
    export class Youtube {
        constructor(key: string);
        key: string;
        getPlaylistByID(id: string): Promise<YoutubePlaylist | null>;
        search(
            query: string,
            limit?: number,
            options?: object
        ): Promise<Array<YoutubeChannel | YoutubePlaylist | YoutubeVideo>>;
        searchVideos(
            query: string,
            limit?: number,
            options?: object
        ): Promise<YoutubeVideo[]>;
    }

    export class YoutubePlaylist {
        constructor(youtube: Youtube, data: object);
        youtube: Youtube;
        type: 'playlist';
        videos: YoutubeVideo[];
        getVideos(limit?: number, options?: object): Promise<YoutubeVideo[]>;
    }

    export class YoutubeVideo {
        constructor(youtube: Youtube, data: object);
        youtube: Youtube;
        type: 'video';
        url: string;
    }

    export class YoutubeChannel {
        type: 'channel';
    }

    export default Youtube;
}

declare module 'simple-youtube-stream';
