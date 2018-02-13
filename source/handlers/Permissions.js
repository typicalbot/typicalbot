const Constants         = require("../utility/Constants");
const path              = require("path");
const klaw              = require("klaw");

const { Collection }    = require("discord.js");
const PermissionLevel   = require("../structures/PermissionLevel");

class PermissionsHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        this.levels = new Collection();

        this.init();
    }

    init() {
        klaw(path.join(__dirname, "..", "permissions")).on("data", item => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const req = require(path.join(file.dir, file.base));
            const level = new req(this.client);

            this.levels.set(level.level, level);
        }).on("end", () => {
            this.levels = this.levels.sort((a,b) => b.level - a.level);
        });
    }

    define(level) {
        return this.levels.get(level);
    }

    fetch(guild, member, ignoreStaff = false) {
        if (!member.guild) member = guild.member(member.id);
        if (!member) return this.levels.get(0);

        for (const level of this.levels.values()) {
            if (level.level === 0 && this.levels.get(-1).check(guild, member)) return this.levels.get(-1);
            
            if (!(ignoreStaff && level.staff && !level.staffOverride)) if (level.check(guild, member)) return level;
        }

        return this.levels.get(0);
    }
}

module.exports = PermissionsHandler;