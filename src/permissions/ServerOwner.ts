import { Guild, GuildMember } from 'discord.js';
import { PermissionsLevels } from '../lib/utils/constants';
import PermissionLevel from '../structures/PermissionLevel';

export default class extends PermissionLevel {
    title = 'Server Owner';
    level = PermissionsLevels.SERVER_OWNER;

    check(guild: Guild, member: GuildMember) {
        return guild.ownerID === member.id;
    }
}
