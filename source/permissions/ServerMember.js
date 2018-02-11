const PermissionLevelStr = require("../structures/PermissionLevel");
const Constants = require("../utility/Constants");

class PermissionLevel extends PermissionLevelStr {
    constructor() {
        super({
            "title": "Server Member",
            "level": Constants.Permissions.Levels.SERVER_MEMBER
        });
    }
}

module.exports = PermissionLevel;