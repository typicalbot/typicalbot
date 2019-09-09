const Constants = require('../utility/Constants');

class Command {
    constructor(client, name, path, {
        description, usage, aliases, dm, permission, mode, access,
    }) {
        Object.defineProperty(this, 'client', { value: client });

        this.name = name;

        this.path = path;

        this.description = description || 'Description Not Provided';

        this.usage = usage || 'Usage Not Provided';

        this.aliases = aliases || new Array();

        this.dm = dm || false;

        this.permission = permission || Constants.Permissions.Levels.SERVER_MEMBER;

        this.mode = mode || Constants.Modes.FREE;

        this.access = access || Constants.Access.Levels.DEFAULT;
    }
}

module.exports = Command;
