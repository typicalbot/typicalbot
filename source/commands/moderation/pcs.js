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
        const args = /(list|clear|add|remove)(?:\s+(\w+)(?:\s+(?:(?:{{response:\s*([A-Za-z0-9\s!@#$%^&*().?:;\-_=+"\\'\/<>\[\]]+)}}|{{dm:\s*([A-Za-z0-9\s!@#$%^&*().?:;\-_=+"\\'\/<>\[\]]+)}}|{{\+role:\s*([A-Za-z0-9\s!@#$%^&*().?:;\-_=+"\\'\/<>\[\]]+)}}|{{\-role:\s*([A-Za-z0-9\s!@#$%^&*().?:;\-_=+"\\'\/<>\[\]]+)}}|(?:(?:-p|--permissions)\s+(\d+))|(-d|--delete)|\s+)+))?)?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);

        const action = args[1],
            command = args[2],
            response = args[3],
            dm = args[4],
            addRoles = args[5],
            removeRoles = args[6],
            reqPermissions = args[7],
            msgDelete = args[8];

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

            if (this.client.commands.fetch(command) && pcList.map(pc => pc.command).includes(command)) return message.error("This command already exists.");
            
            pcList.push({ command, response, dm, addRoles, removeRoles, reqPermissions, delete: msgDelete });

            this.client.settings.update(message.guild.id, { pcs: pcList });
        } else if (action === "remove") {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

        }
    }
};
