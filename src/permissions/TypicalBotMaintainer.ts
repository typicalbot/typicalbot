import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PermissionsLevels } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'TypicalBot Maintainer';
    level = PermissionsLevels.TYPICALBOT_MAINTAINER;

    check(_guild: Guild, member: GuildMember) {
        return this.client.config.maintainers.includes(member.id);
    }
}
