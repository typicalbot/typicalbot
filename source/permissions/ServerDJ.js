const PermissionLevelStr = require("../structures/PermissionLevel");
const Constants = require("../utility/Constants");

class NewPermissionLevel extends PermissionLevelStr {
    constructor() {
        super({
            "title": "Server DJ",
            "level": Constants.Permissions.Levels.SERVER_DJ
        });
    }

    check(guild, member) {
        const roles = PermissionLevelStr.fetchRoles(guild, "dj");
        if (!roles.length) return false;

        for (const role of roles) {
            if (member.roles.has(role)) return true;
        }
        
        return false;
    }
}

module.exports = NewPermissionLevel;