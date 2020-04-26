import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PermissionsLevels } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Bot Owner';
    level = PermissionsLevels.BOT_OWNER;

    check(_guild: Guild, member: GuildMember) {
        return this.client.owners.includes(member.id);
    }
}
