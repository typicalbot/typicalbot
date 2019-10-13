import { Structures } from 'discord.js';
import Stream from '../structures/Stream';

export class TypicalGuild extends Structures.get('Guild') {
    _guildStream: Stream | null = null;

    get guildStream() {
        if (!this._guildStream)
            this._guildStream = new Stream(this.client, this);
        return this._guildStream as Stream;
    }

    fetchSettings() {
        return this.client.settings.fetch(this.id);
    }

    async fetchPermissions(userID: string, ignoreStaff = false) {
        return this.client.handlers.permissions.fetch(
            this,
            userID,
            ignoreStaff
        );
    }

    async buildModerationLog() {
        return this.client.handlers.moderationLog.buildCase(this);
    }

    translate(key: string, args?: object) {
        const language = this.client.translate.get(this.settings.language);

        if (!language) throw 'Guild: Invalid language set in settings.';

        return language(key, args);
    }
}

Structures.extend('Guild', () => TypicalGuild);
