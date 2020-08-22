import { Guild, GuildMember } from 'discord.js';
import Cluster from '../TypicalClient';
import { PermissionLevelOptions } from '../types/typicalbot';
import { PERMISSION_ROLE_TITLE } from '../utils/constants';

export default class PermissionLevel {
    title: string;
    level: -1 | 0 | 2 | 3 | 4 | 10;
    staff = false;
    staffOverride = false;
    client: Cluster;

    constructor(client: Cluster, options: PermissionLevelOptions) {
        this.client = client;
        this.title = options.title;
        this.level = options.level;

        if (options.staff) this.staff = options.staff;
        if (options.staffOverride) this.staffOverride = options.staffOverride;
    }

    fetchRoles(guild: Guild,
        permission: 'blacklist' | 'moderator' | 'administrator') {
        const pool = guild.settings.roles[permission].filter((role) =>
            guild.roles.cache.has(role));

        let roleName: string;
        switch (permission) {
            case 'blacklist':
                roleName = PERMISSION_ROLE_TITLE.BLACKLIST.toLowerCase();
                break;
            case 'administrator':
                roleName = PERMISSION_ROLE_TITLE.ADMINISTRATOR.toLowerCase();
                break;
            default:
                roleName = PERMISSION_ROLE_TITLE.MODERATOR.toLowerCase();
        }

        const permRole = guild.roles.cache.find((role) => role.name.toLowerCase() === roleName);
        if (permRole && !pool.includes(permRole.id)) pool.push(permRole.id);

        return pool;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check(_guild: Guild, _member: GuildMember): boolean {
        throw new Error('Unsupported operation.');
    }
}
