import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PERMISSION_LEVEL } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Blacklisted';
    level = PERMISSION_LEVEL.SERVER_BLACKLISTED;

    check(guild: Guild, member: GuildMember) {
        const roleIDs = this.fetchRoles(guild, 'blacklist');

        return roleIDs.some((id) => member.roles.cache.has(`${BigInt(id)}`));
    }
}
