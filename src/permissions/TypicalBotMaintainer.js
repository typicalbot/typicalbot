const PermissionLevelStr = require('../structures/PermissionLevel');
const Constants = require('../utility/Constants');

class TypicalBotCreator extends PermissionLevelStr {
    constructor() {
        super({
            title: 'TypicalBot Maintainer',
            level: Constants.Permissions.Levels.TYPICALBOT_MAINTAINER,
            staff: true,
            staffOverride: true,
        });
    }

    check(guild, member) {
        return process.env.MAINTAINERS.includes(member.id);
    }
}

module.exports = TypicalBotCreator;
