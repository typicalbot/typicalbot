const Function = require('../structures/Function');

class Error extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(error, ...args) {
        if (error === 'usage') {
            const [command] = args;

            return `Invalid command usage. Check \`${this.client.config.prefix}help ${command.name}\` for more information.`;
        }
        if (error === 'perms') {
            const [command, uLevel] = args;
            const rLevel = this.client.handlers.permissions.levels.get(command.permission);

            return `Your permission level is too low to execute that command. The command requires permission level ${rLevel.level} (${rLevel.title}) and you are level ${uLevel.level} (${uLevel.title}).`;
        }
    }
}

module.exports = Error;
