const Function = require("../structures/Function");

class New extends Function {
    constructor(client, name) {
        super(client, name);
    }

    execute(error, ...args) {
        if (error === "usage") {
            const [ command ] = args;

            return `Invalid command usage. Check \`${this.client.config.prefix}help ${command.name}\` for more information.`;
        } else if (error === "perms") {
            const [ command, uLevel ] = args;
            const rLevel = this.client.permissionsManager.define(command.permission);
            
            return `Your permission level is too low to execute that command. The command requires permission level ${rLevel.level} (${rLevel.title}) and you are level ${uLevel.level} (${uLevel.title}).`;
        } else if (error === "elevation") {
            const [ command, uLevel, rLevel ] = args;
            const rrLevel = this.client.permissionsManager.define(rLevel);
            
            return `This server requires elevated permissions to use that command. The command requires permission level ${rrLevel.level} (${rrLevel.title}) and you are level ${uLevel.level} (${uLevel.title}).`;
        }
    }
}

module.exports = New;
