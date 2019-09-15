const path = require('path');
const klaw = require('klaw');

const { Collection } = require('discord.js');

class PermissionsHandler {
    constructor(client) {
        Object.defineProperty(this, 'client', { value: client });

        this.levels = new Collection();

        this.init();
    }

    init() {
        klaw(path.join(__dirname, '..', 'permissions')).on('data', (item) => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== '.js') return;

            const req = require(path.join(file.dir, file.base));
            const level = new req(this.client);

            this.levels.set(level.level, level);
        }).on('end', () => {
            this.levels = this.levels.sort((a, b) => b.level - a.level);
        });
    }

    async fetch(guild, user, ignoreStaff = false) {
        const member = await guild.members.fetch(user.id);

        if (!member) return this.levels.get(0);

        for (const level of this.levels.values()) {
            if (level.level === 0 && this.levels.get(-1).check(guild, member)) return this.levels.get(-1);

            if (!(ignoreStaff && level.staff && !level.staffOverride)) if (level.check(guild, member)) return level;
        }

        return this.levels.get(0);
    }
}

module.exports = PermissionsHandler;
