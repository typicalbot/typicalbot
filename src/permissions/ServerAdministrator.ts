import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PermissionsLevels } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Administrator';
    level = PermissionsLevels.SERVER_ADMINISTRATOR;

    check(guild: Guild, member: GuildMember) {
        if (member.permissions.has('ADMINISTRATOR')) return true;

        const roleIDs = this.fetchRoles(guild, 'administrator');

        return roleIDs.some((id) => member.roles.cache.has(id));
    }
}
