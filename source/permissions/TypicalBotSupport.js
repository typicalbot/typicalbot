const PermissionLevelStr = require("../structures/PermissionLevel");
const Constants = require("../utility/Constants");

class NewPermissionLevel extends PermissionLevelStr {
    constructor() {
        super({
            "title": "TypicalBot Support",
            "level": Constants.Permissions.Levels.TYPICALBOT_SUPPORT
        });
    }

    check(guild, member) {
        return !!guild.client.config.support[member.id];
    }
}

module.exports = NewPermissionLevel;