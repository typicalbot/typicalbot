import { Structures, Guild } from 'discord.js';
import { TypicalGuildMessage } from '../types/typicalbot';

export class TypicalGuild extends Guild {
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

    async buildModerationLog(message: TypicalGuildMessage) {
        this.client.handlers.moderationLog.buildCase(message, this);
    }

    translate(key: string, args: object) {
        const language = this.client.translate.get(this.settings.language);

        if (!language) throw 'Guild: Invalid language set in settings.';

        return language(key, args);
    }
}

Structures.extend('Guild', () => TypicalGuild);
