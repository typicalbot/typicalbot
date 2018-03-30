const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Take a role from you a role off of the public roles list.",
            usage: "take <role-name>",
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))?(?:\s+)?(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const actualUserPermissions = await message.member.fetchPermissions(true);
        const member = await this.client.functions.resolveMember(message, args, false);

        if (member) {
            if (actualUserPermissions.level < Constants.Permissions.Levels.SERVER_ADMINISTRATOR)
                return message.error(this.client.functions.error("perms", { permission: Constants.Permissions.Levels.SERVER_ADMINISTRATOR }, actualUserPermissions));

            const role = args[4] ? message.guild.roles.get(args[4]) : args[5] ? message.guild.roles.find(r => r.name.toLowerCase() === args[5].toLowerCase()) : null;
            if (!role) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
            if (!role.editable) return message.error(`Insufficient permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to take and that I have the Manage Roles permission.`);

            member.roles.remove(role)
                .then(() => message.reply(`Success.`))
                .catch(err => message.error(`An error occured while processing that request.`));
        } else {
            const role = args[4] ? message.guild.roles.get(args[4]) : args[5] ? message.guild.roles.find(r => r.name.toLowerCase() === args[5].toLowerCase()) : null;
            if (!role) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
            if (!role.editable) return message.error(`Insufficient permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to take and that I have the Manage Roles permission.`);

            const publicList = message.guild.settings.roles.public;
            if (!publicList.includes(role.id)) return message.error("The requested role isn't on the list of public roles.");

            if (!message.member) return message.error("Apparently you don't exist! I'm not too sure what is causing this, but it's an issue with the Discord.JS library. Sorry!");

            message.member.roles.remove(role)
                .then(() => message.reply(`Success.`))
                .catch(err => message.error(`An error occured while processing that request.`));
        }
    }
};
