const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Take a role from you a role off of the public roles list.",
            usage: "take <role-name>",
            mode: "strict"
        });
    }

    execute(message, permissionLevel) {
        const args = /take\s+(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(message.content);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const role = args[1] ? message.guild.roles.get(args[1]) : args[2] ? message.guild.roles.find(r => r.name.toLowerCase() === args[2].toLowerCase()) : null;
        if (!role) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
        if (!role.editable) return message.error(`Insufficient permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give and that I have the Manage Roles permission.`);

        const publicList = message.guild.settings.roles.public;
        if (!publicList.includes(role.id)) return message.error("The requested role isn't on the list of public roles.");

        message.member.removeRole(role)
            .then(() => message.reply(`Success.`))
            .catch(err => message.error(`An error occured while processing that request.`));
    }
};
