const Command = require("../../structures/Command");
const regex = require("../../utility/RegExp");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "role",
            description: "Manage or view roles in a server.",
            usage: "Check `$roles help` for this command's usage.",
            aliases: ["roles"],
            mode: "strict",
            permission: 3
        });
    }

    execute(message, response, permissionLevel) {
        const args = regex.say.exec(message.content);
        if (!args) return response.usage(this);

        const realPermissionLevel = this.client.permissionsManager.get(message.guild, message.author, true);

        const subcommand = args[1], args2 = args[2];

        if (subcommand === "help") {
            response.send(
                "**__Usage For:__** roles\n"
                + "=> **[Param]** : Optional Parameter\n"
                + "=> **<Param>** : Required Parameter\n\n"
                + "```\n"
                + "roles list\nroles <'give'|'take'> <@user> <role-name>\nroles public <'list'|'clear'|'add'|'remove'> <role-name>\n"
                + "```"
            );
        } else if (subcommand === "list") {
            const content = this.client.functions.pagify(message.guild.roles.map(k => ` • ${k.name} (${k.id})`), args2 || 1);

            response.send(`**__${message.guild.name}'s Roles:__**\n\n\`\`\`${content}\`\`\``);
        } else if (subcommand === "info" || subcommand === "information") {

        } else if (subcommand === "give") {

        } else if (subcommand === "take") {

        } else if (subcommand === "public") {

        } else if (subcommand === "create") {

        } else if (subcommand === "delete") {

        }
    }
};
