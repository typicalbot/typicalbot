import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../structures/PermissionLevel';
import Constants from '../utility/Constants';

export default class extends PermissionLevel {
    title = 'Server Moderator';
    level = Constants.PermissionsLevels.SERVER_MODERATOR;

    check(guild: Guild, member: GuildMember) {
        const roleIDs = this.fetchRoles(guild, 'moderator');

        return roleIDs.some((id) => member.roles.cache.has(id));
    }
}
