const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Provides either your permission level or another user's level.",
            usage: 'level [@user|user-id|user-tag]',
            aliases: ['mylevel'],
            mode: Constants.Modes.STRICT,
        });
    }

    async execute(message, parameters) {
        const args = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i.exec(parameters);

        const member = await this.client.functions.resolveMember(message, args);
        const { user } = member;

        const permissionsHere = await this.client.handlers.permissions.fetch(message.guild, user, true);
        const permissions = await this.client.handlers.permissions.fetch(message.guild, user);

        message.reply(`**__${user.tag}'s Permission Level:__** ${permissions.level} | ${permissions.title}${permissionsHere.level !== permissions.level ? ` (${permissionsHere.level} | ${permissionsHere.title})` : ''}`);
    }

    async embedExecute(message, parameters) {
        const args = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i.exec(parameters);

        const member = await this.client.functions.resolveMember(message, args);
        const { user } = member;

        const permissionsHere = await this.client.handlers.permissions.fetch(message.guild, user, true);
        const permissions = await this.client.handlers.permissions.fetch(message.guild, user);

        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle(`${user.tag}'s Permission Level`)
            .setDescription(`Level ${permissions.level} | ${permissions.title}${permissionsHere.level !== permissions.level ? ` (${permissionsHere.level} | ${permissionsHere.title})` : ''}`)
            .send();
    }
};
