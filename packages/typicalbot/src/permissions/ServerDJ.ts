import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../structures/PermissionLevel';
import Constants from '../utility/Constants';

export default class extends PermissionLevel {
    title = 'Server DJ';
    level = Constants.PermissionsLevels.SERVER_DJ;

    check(guild: Guild, member: GuildMember) {
        const roleIDs = this.fetchRoles(guild, 'dj');

        return roleIDs.some(id => member.roles.has(id));
    }
}
