const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Provides either your permission level or another user's level.",
            aliases: ["mylevel"],
            usage: "perms [@user]",
            mode: "strict"
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i.exec(parameters);

        const member = await this.client.functions.resolveMember(message, args);
        const user = member.user;

        const permissionsHere = this.client.permissions.fetch(message.guild, user, true);
        const permissions = this.client.permissions.fetch(message.guild, user);

        message.reply(`**__Your Permission Level:__** ${permissions.level} | ${permissions.title}${permissionsHere.level !== permissions.level ? ` (${permissionsHere.level} | ${permissionsHere.title})` : ""}`);
    }

    async embedExecute(message, parameters, permissionLevel) {
        const args = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?/i.exec(parameters);

        const member = await this.client.functions.resolveMember(message, args);
        const user = member.user;
        
        const permissionsHere = this.client.permissions.fetch(message.guild, user, true);
        const permissions = this.client.permissions.fetch(message.guild, user);

        message.buildEmbed()
            .setColor(0x00adff)
            .setTitle("User Permission Level")
            .setDescription(`Level ${permissions.level} | ${permissions.title}${permissionsHere.level !== permissions.level ? ` (${permissionsHere.level} | ${permissionsHere.title})` : ""}`)
            .send();
    }
};
