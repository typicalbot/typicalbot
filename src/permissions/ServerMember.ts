import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PERMISSION_LEVEL } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Member';
    level = PERMISSION_LEVEL.SERVER_MEMBER;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check(_guild: Guild, _member: GuildMember) {
        return true;
    }
}
