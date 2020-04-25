import { Structures } from 'discord.js';
import ModerationLog from '../structures/ModerationLog';

export class TypicalGuild extends Structures.get('Guild') {
    fetchSettings() {
        return this.client.settings.fetch(this.id);
    }

    async fetchPermissions(userID: string, ignoreStaff = false) {
        return this.client.handlers.permissions.fetch(this, userID, ignoreStaff);
    }

    async buildModerationLog(): Promise<ModerationLog> {
        return this.client.handlers.moderationLog.buildCase(this);
    }

    translate(key: string, args?: object) {
        const language = this.client.translate.get(this.settings?.language || 'en-US');

        if (!language) throw 'Guild: Invalid language set in settings.';

        return language(key, args);
    }
}

Structures.extend('Guild', () => TypicalGuild);
