const PermissionLevelStr = require("../structures/PermissionLevel");
const Constants = require("../utility/Constants");

class ServerAdministrator extends PermissionLevelStr {
    constructor() {
        super({
            "title": "Server Administrator",
            "level": Constants.Permissions.Levels.SERVER_ADMINISTRATOR
        });
    }

    check(guild, member) {
        if (member.permissions.has("ADMINISTRATOR")) return true;

        const roles = PermissionLevelStr.fetchRoles(guild, "administrator");
        if (!roles.length) return false;

        for (const role of roles) {
            if (member.roles.has(role)) return true;
        }

        return false;
    }
}

module.exports = ServerAdministrator;