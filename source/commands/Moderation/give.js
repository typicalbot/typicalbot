const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name, path) {
        super(client, name, path, {
            description: "Receive a role off of the public roles list.",
            usage: "give <role-name>",
            mode: "strict"
        });
    }

    execute(message, response, permissionLevel) {
        const args = /give\s+(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(message.content);
        if (!args) return response.usage(this);

        const role = args[1] ? message.guild.roles.get(args[1]) : args[2] ? message.guild.roles.find(r => r.name.toLowerCase() === args[2].toLowerCase()) : null;
        if (!role) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
        if (!role.editable) return response.error(`Insufficient permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give and that I have the Manage Roles permission.`);

        const publicList = message.guild.settings.roles.public;
        if (!publicList.includes(role.id)) return response.error("The requested role isn't on the list of public roles.");

        message.member.addRole(role)
            .then(() => response.reply(`Success.`))
            .catch(err => response.error(`An error occured while processing that request.`));
    }
};
