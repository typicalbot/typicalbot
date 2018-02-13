const PermissionLevelStr = require("../structures/PermissionLevel");
const Constants = require("../utility/Constants");

class NewPermissionLevel extends PermissionLevelStr {
    constructor() {
        super({
            "title": "TypicalBot Administrator",
            "level": Constants.Permissions.Levels.TYPICALBOT_ADMINISTRATOR,
            "staff": true,
            "staffOverride": true
        });
    }

    check(guild, member) {
        return !!guild.client.config.administrators[member.id];
    }
}

module.exports = NewPermissionLevel;