import * as ytdl from 'ytdl-core';
import * as YAPI from 'simple-youtube-api';
import Video from '../structures/Video';
import Cluster from '../index.js';
import { TypicalGuildMessage, GuildSettings } from '../types/typicalbot.js';
import PermissionLevel from '../structures/PermissionLevel.js';
import { Youtube } from 'simple-youtube-api';

export default class AudioUtil {
    client: Cluster;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TBYT: any;

    constructor(client: Cluster) {
        this.client = client;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.TBYT = new YAPI(this.client.config.apis.youtube);
    }

    withinLimit(message: TypicalGuildMessage, video: Video) {
        return (
            parseInt(video.length, 10) <=
            (message.guild.settings.music.timelimit || 1800)
        );
    }

    async fetchInfo(url: string, message: TypicalGuildMessage) {
        const info = await ytdl.getInfo(url);
        return new Video(url, info, message);
    }

    async fetchPlaylist(message: TypicalGuildMessage, id: string) {
        const YT = (message.guild.settings.music.apikey
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              new YAPI(message.guild.settings.music.apikey)
            : this.TBYT) as Youtube;

        const playlist = await YT.getPlaylistByID(id);
        const videos = playlist ? await playlist.getVideos() : [];

        return videos;
    }

    async search(settings: GuildSettings, query: string) {
        const YT = (settings.music.apikey
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              new YAPI(settings.music.apikey)
            : this.TBYT) as Youtube;

        return YT.searchVideos(query, 10).catch(() => []);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchError(message: TypicalGuildMessage, error: any) {
        if (!error.errors)
            return message.translate('music/music:UNKNOWN', {
                error: error.stack
            });
        const err = error.errors[0].reason;
        if (!err) return message.translate('music/music:UNKNOWN', { error });

        if (err === 'keyInvalid')
            return message.translate('music/music:INVALID_KEY');
        if (err === 'quotaExceeded')
            return message.translate('music/music:QUOTA_EXCEEDED');

        return message.translate('music/music:UNKNOWN', { error: err });
    }

    permissionCheck(
        message: TypicalGuildMessage,
        override: string,
        permissions: PermissionLevel
    ) {
        const { level } = permissions;

        const musicperms = message.guild.settings.music.default;
        if (override === 'off')
            if (
                musicperms === 'all' ||
                (musicperms === 'dj' && level >= 1) ||
                (musicperms === 'moderator' && level >= 2) ||
                (musicperms === 'administrator' && level >= 3)
            )
                return { has: true };
        if (
            override === 'all' ||
            (override === 'dj' && level >= 1) ||
            (override === 'moderator' && level >= 2) ||
            (override === 'administrator' && level >= 3)
        )
            return { has: true };
        return { has: false, req: override === 'off' ? musicperms : override };
    }

    async hasPermissions(message: TypicalGuildMessage, override: string) {
        const userTrueLevel = await this.client.handlers.permissions.fetch(
            message.guild,
            message.author.id,
            true
        );

        const permissionCheck = this.permissionCheck(
            message,
            override,
            userTrueLevel
        );
        if (permissionCheck.has) return true;

        const rrLevel = this.client.handlers.permissions.levels.get(
            permissionCheck.req === 'dj'
                ? 1
                : permissionCheck.req === 'moderator'
                ? 2
                : permissionCheck.req === 'administrator'
                ? 3
                : 0
        );

        const error = message.translate('music/music:MISSING_PERM', {
            requiredLevel: rrLevel && rrLevel.level,
            requiredTitle: rrLevel && rrLevel.title,
            userLevel: userTrueLevel && userTrueLevel.level,
            userTitle: userTrueLevel && userTrueLevel.title
        });

        message.error(error);
        return false;
    }
}
