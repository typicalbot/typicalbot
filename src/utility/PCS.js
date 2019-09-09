const Constants = require('./Constants');

module.exports = (client, pcs) => new Object({
    client,
    name: pcs.command,
    path: null,
    description: 'Custom Command',
    usage: 'Custom Command',
    aliases: null,
    dm: false,
    permission: pcs.permission,
    mode: Constants.Modes.STRICT,
    access: Constants.Access.Levels.DEFAULT,
    execute: async (message, parameters, permissionLevel) => {
        this.client = client;

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);
        if (actualUserPermissions.level < pcs.permission) return message.error(this.client.functions.error('perms', { permission: pcs.permission }, actualUserPermissions));

        if (pcs.response) message.send(pcs.response);
        if (pcs.dm) message.author.send(pcs.dm).catch(console.error);

        if (pcs.delete) message.delete({ timeout: 1000, reason: 'PCS Auto Delete' }).catch(console.error);
    },
});
