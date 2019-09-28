import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../structures/PermissionLevel';
import Constants from '../utility/Constants';

export default class extends PermissionLevel {
    title = 'TypicalBot Maintainer';
    level = Constants.PermissionsLevels.TYPICALBOT_MAINTAINER;

    check(_guild: Guild, member: GuildMember) {
        return this.client.config.maintainers.includes(member.id);
    }
}
