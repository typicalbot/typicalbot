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

    execute(message, parameters, permissionLevel) {
        const args = /(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const role = args[1] ? message.guild.roles.get(args[1]) : args[2] ? message.guild.roles.find(r => r.name.toLowerCase() === args[2].toLowerCase()) : null;
        if (!role) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
        if (!role.editable) return message.error(`Insufficient permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give and that I have the Manage Roles permission.`);

        const publicList = message.guild.settings.roles.public;
        if (!publicList.includes(role.id)) return message.error("The requested role isn't on the list of public roles.");

        if (!message.member) return message.error("Apparently you don't exist! I'm not too sure what is causing this, but it's an issue with the Discord.JS library. Sorry!");

        message.member.roles.remove(role)
            .then(() => message.reply(`Success.`))
            .catch(err => message.error(`An error occured while processing that request.`));
    }
};
