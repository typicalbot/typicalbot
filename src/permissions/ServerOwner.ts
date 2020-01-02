import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../structures/PermissionLevel';
import Constants from '../utility/Constants';

export default class extends PermissionLevel {
    title = 'Server Owner';
    level = Constants.PermissionsLevels.SERVER_OWNER;

    check(guild: Guild, member: GuildMember) {
        return guild.ownerID === member.id;
    }
}
