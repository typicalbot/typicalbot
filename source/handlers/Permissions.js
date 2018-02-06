const Constants = require("../utility/Constants");
const path      = require("path");
const klaw      = require("klaw");

class PermissionsHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        this.init();
    }

    init() {
        klaw(path.join(__dirname, "..", "permissions")).on("data", item => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const level = require(path.join(file.dir, file.base));

            this.levels.set(level.level, level);
        });
    }

}

module.exports = PermissionsHandler;