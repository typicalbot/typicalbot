import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PERMISSION_LEVEL } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Bot Owner';
    level = PERMISSION_LEVEL.BOT_OWNER;

    check(_guild: Guild, member: GuildMember) {
        return this.client.owners.includes(member.id);
    }
}
