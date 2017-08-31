const Command = require("../../structures/Command");
const regex = require("../../utility/RegExp");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "role",
            description: "Manage or view roles in a server.",
            usage: "Check `$roles help` for this command's usage.",
            aliases: ["roles"],
            mode: "strict"
        });
    }

    async execute(message, response, permissionLevel) {
        const args = /roles?\s+(help|list|give|take|public|info|information)(?:\s+(.+))?/i.exec(message.content);
        if (!args) return response.usage(this);

        const actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);

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
            const content = this.client.functions.pagify(
                message.guild.roles.filterArray(r => r.position !== 0).sort((a,b) => b.position - a.position).map(r => `${this.client.functions.lengthen(1, r.name, 30)} : ${r.id}`),
                args2 || 1
            );

            response.send(`**__${message.guild.name}'s Roles:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
        } else if (subcommand === "info" || subcommand === "information") {
            const subArgs = /(?:(members)\s+)?(?:(?:(?:<@&)?(\d{17,20})>?|(.+))\s+(\d+)|(?:(?:<@&)?(\d{17,20})>?|(.+)))/i.exec(args2);
            if (!subArgs) return response.usage(this);

            const subAction = subArgs[1];
            const subPage = subArgs[4];

            const subRole = subArgs[2] || subArgs[5] ? message.guild.roles.get(subArgs[2] || subArgs[5]) : subArgs[3] || subArgs[6] ? message.guild.roles.find(r => subArgs[3] ? r.name.toLowerCase() === subArgs[3].toLowerCase() : r.name.toLowerCase() ===  subArgs[6].toLowerCase()) : null;
            if (!subRole) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

            if (subAction === "members") {
                await message.guild.members.fetch().catch(console.error);

                const content = this.client.functions.pagify(
                    subRole.members.map(m => `${this.client.functions.lengthen(1, m.user.username, 30)} : ${m.id}`),
                    subPage || 1
                );

                response.send(`**__${subRole.name}'s Members:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
            }
        } else if (subcommand === "give") {
            if (actualUserPermissions.level < 3) return response.perms({ permission: 3 }, actualUserPermissions);

            const subArgs = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))\s+(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(args2);
            if (!subArgs) return response.usage(this);

            const subMember = await this.client.functions.resolveMember(message, subArgs, false);
            if (!subMember) return response.error("Couldn't fetch the requested member.");

            const subRole = subArgs[4] ? message.guild.roles.get(subArgs[4]) : subArgs[5] ? message.guild.roles.find(r => r.name.toLowerCase() === subArgs[5].toLowerCase()) : null;
            if (!subRole) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
            if (!subRole.editable) return response.error(`Insignificant permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give or take and that I have the Manage Roles permission.`);

            subMember.addRole(subRole)
                .then(() => response.reply(`Success.`))
                .catch(err => response.error(`An error occured while processing that request.`));
        } else if (subcommand === "take") {
            if (actualUserPermissions.level < 3) return response.perms({ permission: 3 }, actualUserPermissions);

            const subArgs = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))\s+(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(args2);
            if (!subArgs) return response.usage(this);

            const subMember = await this.client.functions.resolveMember(message, subArgs, false);
            if (!subMember) return response.error("Couldn't fetch the requested member.");

            const subRole = subArgs[4] ? message.guild.roles.get(subArgs[4]) : subArgs[5] ? message.guild.roles.find(r => r.name.toLowerCase() === subArgs[5].toLowerCase()) : null;
            if (!subRole) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
            if (!subRole.editable) return response.error(`Insignificant permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give or take and that I have the Manage Roles permission.`);

            subMember.removeRole(subRole)
                .then(() => response.reply(`Success.`))
                .catch(err => response.error(`An error occured while processing that request.`));
        } else if (subcommand === "public") {
            const subArgs = /(list|add|remove|clear)(?:\s+(?:(?:<@&)?(\d{17,20})>?|(.+)))?/i.exec(args2);
            if (!subArgs) return response.usage(this);

            const subAction = subArgs[1];

            const subRole = subArgs[2] ? message.guild.roles.get(subArgs[2]) : subArgs[3] ? message.guild.roles.find(r => r.name.toLowerCase() === subArgs[3].toLowerCase()) : null;

            if (subAction === "list") {
                const roleList = message.guild.settings.roles.public.filter(r => message.guild.roles.has(r)).map(r => message.guild.roles.get(r));
                if (!roleList.length) return response.reply("There are no public roles set up for this server.");

                const content = this.client.functions.pagify(
                    roleList.sort((a,b) => b.position - a.position).map(r => `${this.client.functions.lengthen(1, r.name, 30)} : ${r.id}`),
                    subArgs[3] || 1
                );

                response.send(`**__${message.guild.name}'s Public Roles:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
            } else if (subAction === "add") {
                if (actualUserPermissions.level < 3) return response.perms({ permission: 3 }, actualUserPermissions);

                if (!subRole) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                const roleList = message.guild.settings.roles.public.filter(r => message.guild.roles.has(r));

                if (roleList.includes(subRole.id)) return response.error("The request role is already in the list of public roles.");

                roleList.push(subRole.id);

                this.client.settingsManager.update(message.guild.id, { roles: { public: roleList } })
                    .then(() => response.reply("Success."))
                    .catch(err => response.error(`An error occured while processing that request\n${String(err).substring(0, 500)}`));
            } else if (subAction === "remove") {
                if (actualUserPermissions.level < 3) return response.perms({ permission: 3 }, actualUserPermissions);

                if (!subRole) return response.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                const roleList = message.guild.settings.roles.public.filter(r => message.guild.roles.has(r));

                if (!roleList.includes(subRole.id)) return response.error("The request role isn't in the list of public roles.");

                roleList.splice(roleList.indexOf(subRole.id), 1);

                this.client.settingsManager.update(message.guild.id, { roles: { public: roleList } })
                    .then(() => response.reply("Success."))
                    .catch(err => response.error(`An error occured while processing that request.`));

            } else if (subAction === "clear") {
                if (actualUserPermissions.level < 3) return response.perms({ permission: 3 }, actualUserPermissions);

                this.client.settingsManager.update(message.guild.id, { roles: { public: [] } })
                    .then(() => response.reply("Success."))
                    .catch(err => response.error(`An error occured while processing that request.`));
            }
        } else if (subcommand === "create") {
            if (actualUserPermissions.level < 3) return response.perms({ permission: 3 }, actualUserPermissions);

        } else if (subcommand === "delete") {
            if (actualUserPermissions.level < 3) return response.perms({ permission: 3 }, actualUserPermissions);

        }
    }
};
