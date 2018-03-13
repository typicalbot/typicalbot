/* eslint-disable no-useless-escape */

const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Create personalized commands.",
            usage: "pcs <add|remove> <pcs-command> [options]",
            mode: Constants.Modes.STRICT,
            access: Constants.Access.Levels.DONOR
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(list|clear|add|remove)(?:\s+(\w+)(?:\s+(.+))?)?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);

        console.log(args);

        const action = args[1],
            command = args[2],
            sub = args[3];
        const response = sub ? /{{response:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>\[\]]+)}}/.match(sub) : null,
            dm = sub ? /{{dm:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>\[\]]+)}}/.match(sub) : null,
            addRoles = sub ? /{{\+role:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>\[\]]+)}}/.match(sub) : null,
            removeRoles = sub ? /{{\-role:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>\[\]]+)}}/.match(sub) : null,
            reqPermissions = sub ? /(?:(?:-p|--permissions)\s+(\d+))/.match(sub) : null,
            msgDelete = sub ? /(-d|--delete)/.match(sub) : null;

        if (action === "list") {

        } else if (action === "clear") {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

        } else if (action === "add") {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));
            if (!command) return message.error("You must provide a command.");
            if (command.length > 14) return message.error("You cannot add a custom command with a name over 14 characters long.");
            if (reqPermissions && reqPermissions < Constants.Permissions.Levels.SERVER_MEMBER) return message.error("You cannot use a permission level less than Server Member.");
            if (reqPermissions && reqPermissions > Constants.Permissions.Levels.SERVER_OWNER) return message.error("You cannot use a permission level greater than Server Owner.");

            const pcList = message.guild.settings.pcs;

            if (this.client.commands.fetch(command, message.guild.settings) || pcList.map(pc => pc.command).includes(command)) return message.error("This command already exists.");
            
            pcList.push({
                command,
                response: response || null,
                dm: dm || null,
                addRoles: addRoles || null,
                removeRoles: removeRoles || null,
                permission: reqPermissions || 0,
                delete: !!msgDelete
            });

            this.client.settings.update(message.guild.id, { pcs: pcList });
        } else if (action === "remove") {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

        }
    }
};
