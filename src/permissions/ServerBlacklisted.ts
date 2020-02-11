import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../structures/PermissionLevel';
import Constants from '../utility/Constants';

export default class extends PermissionLevel {
    title = 'Server Blacklisted';
    level = Constants.PermissionsLevels.SERVER_BLACKLISTED;

    check(guild: Guild, member: GuildMember) {
        const roleIDs = this.fetchRoles(guild, 'blacklist');

        return roleIDs.some(id => member.roles.cache.has(id));
    }
}
