import { join, parse } from 'path';
import { Collection, Guild } from 'discord.js';
import klaw from 'klaw';
import Cluster from '../lib/TypicalClient';
import PermissionLevel from '../lib/structures/PermissionLevel';

export default class PermissionsHandler {
    client: Cluster;
    levels: Collection<number, PermissionLevel> = new Collection();

    constructor(client: Cluster) {
        this.client = client;
        this.init();
    }

    init() {
        klaw(join(__dirname, '..', 'permissions'))
            .on('data', (item) => {
                const file = parse(item.path);
                if (!file.ext || file.ext !== '.js') return;

                const Permission = ((r) => r.default || r)(require(join(file.dir, file.base)));
                const perm = new Permission(this.client, {});

                this.levels.set(perm.level, perm);
            })
            .on('end', () => {
                this.levels = this.levels.sort((a: PermissionLevel, b: PermissionLevel) =>
                    b.level - a.level);
            });
    }

    async fetch(guild: Guild, userID: string, ignoreStaff = false) {
        const member = await guild.members.fetch(userID);
        if (!member) return this.levels.get(0) as PermissionLevel;

        for (const permLevel of this.levels.values()) {
            if (permLevel.level === 0) {
                const blacklistLevel = this.levels.get(-1);
                if (blacklistLevel?.check(guild, member))
                    return this.levels.get(-1) as PermissionLevel;
            }

            if (ignoreStaff && permLevel.staff && !permLevel.staffOverride)
                continue;

            if (permLevel.check(guild, member)) return permLevel;
        }

        return this.levels.get(0) as PermissionLevel;
    }
}
