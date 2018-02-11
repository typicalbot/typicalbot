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

    fetch(guild, member, ignoreStaff = false) {
        for (const level of this.levels) {
            const [permNumber, permLevel] = level;

            if (permLevel.check(guild, member)) return permLevel;
        }

        return this.levels.get(0);
    }
}

module.exports = PermissionsHandler;