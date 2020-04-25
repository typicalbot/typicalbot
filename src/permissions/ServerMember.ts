import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PermissionsLevels } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Member';
    level = PermissionsLevels.SERVER_MEMBER;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check(_guild: Guild, _member: GuildMember) {
        return true;
    }
}
