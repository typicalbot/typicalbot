const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "DEFAULT",
            description: "DEFAULT",
            usage: "DEFAULT",
            mode: "strict",
            permission: 2
        });
    }

    execute(message, response, permissionLevel) {
        
    }
};
