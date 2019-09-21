const PermissionLevelStr = require('../structures/PermissionLevel');
const Constants = require('../utility/Constants');

class ServerOwner extends PermissionLevelStr {
    constructor() {
        super({
            title: 'Server Owner',
            level: Constants.Permissions.Levels.SERVER_OWNER,
        });
    }

    check(guild, member) {
        return guild.ownerID === member.id;
    }
}

module.exports = ServerOwner;
