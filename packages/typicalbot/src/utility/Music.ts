import * as ytdl from 'ytdl-core';
import YAPI from 'simple-youtube-api';
import * as configs from '../../../../config.json';
import Video from '../structures/Video';
import Cluster from '../index.js';
import { GuildMessage, GuildSettings } from '../types/typicalbot.js';
import PermissionLevel from '../structures/PermissionLevel.js';
import { Youtube } from 'simple-youtube-api';

const apiKey = configs.apis.youtube;
const TBYT = new YAPI(apiKey);

export default class AudioUtil {
    client: Cluster;

    constructor(client: Cluster) {
        this.client = client;
    }

    withinLimit(message: GuildMessage, video: Video) {
        return (
            parseInt(video.length, 10) <=
            (message.guild.settings.music.timelimit || 1800)
        );
    }

    async fetchInfo(url: string, message: GuildMessage) {
        const info = await ytdl.getInfo(url);
        return new Video(url, info, message);
    }

    async fetchPlaylist(message: GuildMessage, id: string) {
        const YT = (message.guild.settings.music.apikey
            ? new YAPI(message.guild.settings.music.apikey)
            : TBYT) as Youtube;

        const playlist = await YT.getPlaylistByID(id);
        const videos = playlist ? await playlist.getVideos() : [];

        return videos;
    }

    async search(settings: GuildSettings, query: string) {
        const YT = (settings.music.apikey
            ? new YAPI(settings.music.apikey)
            : TBYT) as Youtube;

        return YT.searchVideos(query, 10).catch(() => []);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchError(message: GuildMessage, error: any) {
        if (!error.errors)
            return message.translate('music:UNKNOWN', {
                error: error.stack
            });
        const err = error.errors[0].reason;
        if (!err) return message.translate('music:UNKNOWN', { error });

        if (err === 'keyInvalid') return message.translate('music:INVALID_KEY');
        if (err === 'quotaExceeded')
            return message.translate('music:QUOTA_EXCEEDED');

        return message.translate('music:UNKNOWN', { error: err });
    }

    permissionCheck(
        message: GuildMessage,
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

    async hasPermissions(message: GuildMessage, override: string) {
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

        const error = message.translate('music:MISSING_PERM', {
            requiredLevel: rrLevel && rrLevel.level,
            requiredTitle: rrLevel && rrLevel.title,
            userLevel: userTrueLevel && userTrueLevel.level,
            userTitle: userTrueLevel && userTrueLevel.title
        });

        message.error(error);
        return false;
    }
}
