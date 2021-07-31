import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PERMISSION_LEVEL } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Moderator';
    level = PERMISSION_LEVEL.SERVER_MODERATOR;

    check(guild: Guild, member: GuildMember) {
        const roleIDs = this.fetchRoles(guild, 'moderator');

        return roleIDs.some((id) => member.roles.cache.has(`${BigInt(id)}`));
    }
}
