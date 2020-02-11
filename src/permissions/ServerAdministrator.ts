import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../structures/PermissionLevel';
import Constants from '../utility/Constants';

export default class extends PermissionLevel {
    title = 'Server Administrator';
    level = Constants.PermissionsLevels.SERVER_ADMINISTRATOR;

    check(guild: Guild, member: GuildMember) {
        if (member.permissions.has('ADMINISTRATOR')) return true;

        const roleIDs = this.fetchRoles(guild, 'administrator');

        return roleIDs.some(id => member.roles.cache.has(id));
    }
}
