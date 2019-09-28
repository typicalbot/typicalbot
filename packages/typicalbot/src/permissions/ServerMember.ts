import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../structures/PermissionLevel';
import Constants from '../utility/Constants';

export default class extends PermissionLevel {
    title = 'Server Member';
    level = Constants.PermissionsLevels.SERVER_MEMBER;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check(_guild: Guild, _member: GuildMember) {
        return true;
    }
}
