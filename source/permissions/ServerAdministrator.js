const PermissionLevelStr = require("../structures/PermissionLevel");
const Constants = require("../utility/Constants");

class NewPermissionLevel extends PermissionLevelStr {
    constructor() {
        super({
            "title": "Server Administrator",
            "level": Constants.Permissions.Levels.SERVER_ADMINISTRATOR
        });
    }

    check(guild, member) {
        const roles = PermissionLevelStr.fetchRoles(guild, "administrator");
        if (!roles.length) return false;

        for (const role of roles) {
            if (member.roles.has(role.id)) return true;
        }
        
        return false;
    }
}

module.exports = NewPermissionLevel;