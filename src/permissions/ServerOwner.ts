import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PERMISSION_LEVEL } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Owner';
    level = PERMISSION_LEVEL.SERVER_OWNER;

    check(guild: Guild, member: GuildMember) {
        return guild.ownerID === member.id;
    }
}
