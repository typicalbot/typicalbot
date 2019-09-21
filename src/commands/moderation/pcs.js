/* eslint-disable no-useless-escape */

const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Create personalized commands.',
            usage: 'pcs <add|remove> <pcs-command> [options]',
            mode: Constants.Modes.STRICT,
            ptb: true,
        });
    }

    async execute(message, parameters) {
        const args = /(list|clear|add|remove)(?:\s+(\w+)(?:\s+(.+))?)?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);

        const action = args[1];
        const command = args[2];
        const sub = args[3];
        const responseA = sub ? /\[\[response:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(sub) : null;
        const dmA = sub ? /\[\[dm:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(sub) : null;
        const addRolesA = sub ? /\[\[\+role:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(sub) : null;
        const removeRolesA = sub ? /\[\[\-role:\s*([A-Za-z0-9\s!@#$%^&*().,?:;\-_=+"\\'\/<>]+)\]\]/i.exec(sub) : null;
        const reqPermissionsA = sub ? /(?:(?:-p|--permissions)\s+(\d+))/i.exec(sub) : null;
        const msgDeleteA = sub ? /(-d|--delete)/i.exec(sub) : null;
        const response = responseA ? responseA[1] : null;
        const dm = dmA ? dmA[1] : null;
        const addRoles = addRolesA ? addRolesA[1] : null;
        const removeRoles = removeRolesA ? removeRolesA[1] : null;
        const reqPermissions = reqPermissionsA ? reqPermissionsA[1] : null;
        const msgDelete = msgDeleteA ? msgDeleteA[1] : null;

        if (action === 'list') {

        } else if (action === 'clear') {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error('perms', { permission: 3 }, actualUserPermissions));
        } else if (action === 'add') {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error('perms', { permission: 3 }, actualUserPermissions));
            if (!command) return message.error('You must provide a command.');
            if (command.length > 14) return message.error('You cannot add a custom command with a name over 14 characters long.');
            if (reqPermissions && reqPermissions < Constants.Permissions.Levels.SERVER_MEMBER) return message.error('You cannot use a permission level less than Server Member.');
            if (reqPermissions && reqPermissions > Constants.Permissions.Levels.SERVER_OWNER) return message.error('You cannot use a permission level greater than Server Owner.');

            const pcList = message.guild.settings.pcs;

            if (this.client.commands.fetch(command, message.guild.settings) || pcList.map((pc) => pc.command).includes(command)) return message.error('This command already exists.');

            pcList.push({
                command,
                response: response || null,
                dm: dm || null,
                addRoles: addRoles || null,
                removeRoles: removeRoles || null,
                permission: reqPermissions || 0,
                delete: !!msgDelete,
            });

            this.client.settings.update(message.guild.id, { pcs: pcList }).then(() => {
                message.reply('Successfully created personal command.');
            }).catch((err) => {
                message.reply('Failed to create personal command.');
            });
        } else if (action === 'remove') {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR) return message.error(this.client.functions.error('perms', { permission: 3 }, actualUserPermissions));
        }
    }
};
