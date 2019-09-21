const PermissionLevelStr = require('../structures/PermissionLevel');
const Constants = require('../utility/Constants');

class ServerMember extends PermissionLevelStr {
    constructor() {
        super({
            title: 'Server Member',
            level: Constants.Permissions.Levels.SERVER_MEMBER,
        });
    }

    check() {
        return true;
    }
}

module.exports = ServerMember;
