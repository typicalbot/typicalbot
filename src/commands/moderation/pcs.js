/* eslint-disable no-useless-escape */

const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Create personalized commands.",
            usage: "pcs <add|remove> <pcs-command> [options]",
            mode: Constants.Modes.STRICT,
            ptb: true
        });
    }

    async execute(message, parameters) {
        const args = /(list|clear|add|remove)(?:\s+(\w+)(?:\s+([\W\w]+))?)?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);

        const action = args[1];
        const command = args[2];
        const optionsSet = args[3];

        if (action === "list") {
            let page = isNaN(command) ? 1 : command;
            const commands = message.guild.settings.pcs;

            if (!commands.length) return message.send("There are no personal commands setup.");

            const count = Math.ceil(commands.length / 10);
            if (page < 1 || page > count) page = 1;

            const list = commands.splice((page - 1) * 10, 10).map((k, i) => ` • **${i + 1}:** ${k.command}`);

            message.send(`**__Personal Commands__**\n\n**Page ${page} / ${count}**\n${list.join("\n")}`);
        } else if (action === "clear") {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

            this.client.settings.update(message.guild.id, { pcs: {} }).then(() => {
                this.client.settings.update(message.guild.id, { pcs: [] }).then(() => {
                    message.reply("Successfully cleared personal commands.");
                }).catch(err => {
                    throw err;
                });
            }).catch(err => {
                message.reply("Failed to create personal command.");
            });
        } else if (action === "add") {
            if (!optionsSet) return message.error("You cannot add a custom command without options.");
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));
            if (!command) return message.error("You must provide a command.");
            if (command.length > 14) return message.error("You cannot add a custom command with a name over 14 characters long.");

            const options = /(--?[\w]+)\s+([^-]+)/g.exec(optionsSet);

            const responseA = options ? /\[\[response:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(options) : null,
                dmA = options ? /\[\[dm:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(options) : null,
                addRolesA = options ? /\[\[\+role:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(options) : null,
                removeRolesA = options ? /\[\[\-role:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(options) : null,
                reqPermissionsA = options ? /(?:(?:-p|--permissions)\s+(\d+))/i.exec(options) : null,
                msgDeleteA = options ? /(-d|--delete)/i.exec(options) : null,
                response = responseA ? responseA[1] : null,
                dm = dmA ? dmA[1] : null,
                addRoles = addRolesA ? addRolesA[1] : null,
                removeRoles = removeRolesA ? removeRolesA[1] : null,
                reqPermissions = reqPermissionsA ? reqPermissionsA[1] : null,
                msgDelete = msgDeleteA ? msgDeleteA[1] : null;

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

            this.client.settings.update(message.guild.id, { pcs: pcList }).then(() => {
                message.reply("Successfully created personal command.");
            }).catch(err => {
                message.reply("Failed to create personal command.");
            });
        } else if (action === "remove") {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

        }
    }
};
