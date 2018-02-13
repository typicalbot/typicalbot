const PermissionLevelStr = require("../structures/PermissionLevel");
const Constants = require("../utility/Constants");

class NewPermissionLevel extends PermissionLevelStr {
    constructor() {
        super({
            "title": "TypicalBot Creator",
            "level": Constants.Permissions.Levels.TYPICALBOT_CREATOR
        });
    }

    check(guild, member) {
        return member.id === guild.client.config.creator;
    }
}

module.exports = NewPermissionLevel;