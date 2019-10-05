import { Structures, GuildMember } from 'discord.js';

export class TypicalGuildMember extends GuildMember {
    async fetchPermissions(ignoreStaff = false) {
        return this.client.handlers.permissions.fetch(
            this.guild,
            this.id,
            ignoreStaff
        );
    }
}

Structures.extend('GuildMember', () => TypicalGuildMember);
