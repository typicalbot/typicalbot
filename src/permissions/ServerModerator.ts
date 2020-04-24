import { Guild, GuildMember } from 'discord.js';
import { PermissionsLevels } from '../lib/utils/constants';
import PermissionLevel from '../structures/PermissionLevel';

export default class extends PermissionLevel {
    title = 'Server Moderator';
    level = PermissionsLevels.SERVER_MODERATOR;

    check(guild: Guild, member: GuildMember) {
        const roleIDs = this.fetchRoles(guild, 'moderator');

        return roleIDs.some((id) => member.roles.cache.has(id));
    }
}
