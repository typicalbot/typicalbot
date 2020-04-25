import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PermissionsLevels } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Owner';
    level = PermissionsLevels.SERVER_OWNER;

    check(guild: Guild, member: GuildMember) {
        return guild.ownerID === member.id;
    }
}
