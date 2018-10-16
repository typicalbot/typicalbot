const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Manage or view roles in a server.",
            usage: "Check `$roles help` for this command's usage.",
            aliases: ["role"],
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(help|list|give|take|public|info|information)(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author, true);

        const subcommand = args[1], args2 = args[2];

        if (subcommand === "help") {
            message.send(
                "**__Usage For:__** roles\n"
                + "=> **[Param]** : Optional Parameter\n"
                + "=> **<Param>** : Required Parameter\n\n"
                + "```\n"
                + "roles list\nroles <'give'|'take'> <@user> <role-name>\nroles public <'list'|'clear'|'add'|'remove'> <role-name>\n"
                + "```"
            );
        } else if (subcommand === "list") {
            const content = this.client.functions.pagify(
                message.guild.roles.filter(r => r.position !== 0).sort((a, b) => b.position - a.position).map(r => `${this.client.functions.lengthen(1, r.name, 30)} : ${r.id}`), 1
            );

            message.send(`**__${message.guild.name}'s Roles:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
        } else if (subcommand === "info" || subcommand === "information") {
            const subArgs = /(?:(members)\s+)?(?:(?:(?:<@&)?(\d{17,20})>?|(.+))\s+(\d+)|(?:(?:<@&)?(\d{17,20})>?|(.+)))/i.exec(args2);
            if (!subArgs) return message.error(this.client.functions.error("usage", this));

            const subAction = subArgs[1];
            const subPage = subArgs[4];

            const subRole = subArgs[2] || subArgs[5] ? message.guild.roles.get(subArgs[2] || subArgs[5]) : subArgs[3] || subArgs[6] ? message.guild.roles.find(r => subArgs[3] ? r.name.toLowerCase() === subArgs[3].toLowerCase() : r.name.toLowerCase() === subArgs[6].toLowerCase()) : null;
            if (!subRole) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

            if (subAction === "members") {
                await message.guild.members.fetch().catch(console.error);

                const content = this.client.functions.pagify(
                    subRole.members.map(m => `${this.client.functions.lengthen(1, m.user.username, 30)} : ${m.id}`),
                    subPage || 1
                );

                message.send(`**__${subRole.name}'s Members:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
            }
        } else if (subcommand === "give") {
            if (actualUserPermissions.level < 3) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

            const subArgs = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))\s+(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(args2);
            if (!subArgs) return message.error(this.client.functions.error("usage", this));

            const subMember = await this.client.functions.resolveMember(message, subArgs, false);
            if (!subMember) return message.error("Couldn't fetch the requested member.");

            const subRole = subArgs[4] ? message.guild.roles.get(subArgs[4]) : subArgs[5] ? message.guild.roles.find(r => r.name.toLowerCase() === subArgs[5].toLowerCase()) : null;
            if (!subRole) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
            if (!subRole.editable) return message.error(`Insignificant permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give or take and that I have the Manage Roles permission.`);
            if (message.member.roles.highest.position <= subRole.position) return message.error("You cannot give yourself or another user your highest role or any role higher.");

            subMember.roles.add(subRole)
                .then(() => message.reply(`Success.`))
                .catch(err => message.error(`An error occured while processing that request.`));
        } else if (subcommand === "take") {
            if (actualUserPermissions.level < 3) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

            const subArgs = /(?:(?:(?:<@!?)?(\d{17,20})>?)|(?:(.+)#(\d{4})))\s+(?:(?:<@&)?(\d{17,20})>?|(.+))/i.exec(args2);
            if (!subArgs) return message.error(this.client.functions.error("usage", this));

            const subMember = await this.client.functions.resolveMember(message, subArgs, false);
            if (!subMember) return message.error("Couldn't fetch the requested member.");

            const subRole = subArgs[4] ? message.guild.roles.get(subArgs[4]) : subArgs[5] ? message.guild.roles.find(r => r.name.toLowerCase() === subArgs[5].toLowerCase()) : null;
            if (!subRole) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");
            if (!subRole.editable) return message.error(`Insignificant permissions given to the bot. Make sure that the highest role I have is above the role you are attempting to give or take and that I have the Manage Roles permission.`);
            if (message.member.roles.highest.position <= subRole.position) return message.error("You cannot take a role from yourself or another user when your highest role is lower than the given role.");

            subMember.roles.remove(subRole)
                .then(() => message.reply(`Success.`))
                .catch(err => message.error(`An error occured while processing that request.`));
        } else if (subcommand === "public") {
            const subArgs = /(list|add|remove|clear)(?:\s+(?:(?:<@&)?(\d{17,20})>?|(.+)))?/i.exec(args2);
            if (!subArgs) return message.error(this.client.functions.error("usage", this));

            const subAction = subArgs[1];

            const subRole = subArgs[2] ? message.guild.roles.get(subArgs[2]) : subArgs[3] ? message.guild.roles.find(r => r.name.toLowerCase() === subArgs[3].toLowerCase()) : null;

            if (subAction === "list") {
                const roleList = message.guild.settings.roles.public.filter(r => message.guild.roles.has(r)).map(r => message.guild.roles.get(r));
                if (!roleList.length) return message.reply("There are no public roles set up for this server.");

                const content = this.client.functions.pagify(
                    roleList.sort((a, b) => b.position - a.position).map(r => `${this.client.functions.lengthen(1, r.name, 30)} : ${r.id}`),
                    subArgs[3] || 1
                );

                message.send(`**__${message.guild.name}'s Public Roles:__**\n\n\`\`\`autohotkey\n${content}\n\`\`\``);
            } else if (subAction === "add") {
                if (actualUserPermissions.level < 3) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

                if (!subRole) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                const roleList = message.guild.settings.roles.public.filter(r => message.guild.roles.has(r));

                if (roleList.includes(subRole.id)) return message.error("The request role is already in the list of public roles.");

                roleList.push(subRole.id);

                this.client.settings.update(message.guild.id, { roles: { public: roleList } })
                    .then(() => message.reply("Success."))
                    .catch(err => message.error(`An error occured while processing that request\n${String(err).substring(0, 500)}`));
            } else if (subAction === "remove") {
                if (actualUserPermissions.level < 3) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

                if (!subRole) return message.error("Invalid role. Please make sure your spelling is correct, and that the role actually exists.");

                const roleList = message.guild.settings.roles.public.filter(r => message.guild.roles.has(r));

                if (!roleList.includes(subRole.id)) return message.error("The request role isn't in the list of public roles.");

                roleList.splice(roleList.indexOf(subRole.id), 1);

                this.client.settings.update(message.guild.id, { roles: { public: roleList } })
                    .then(() => message.reply("Success."))
                    .catch(err => message.error(`An error occured while processing that request.`));

            } else if (subAction === "clear") {
                if (actualUserPermissions.level < 3) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

                this.client.settings.update(message.guild.id, { roles: { public: [] } })
                    .then(() => message.reply("Success."))
                    .catch(err => message.error(`An error occured while processing that request.`));
            }
        } else if (subcommand === "create") {
            if (actualUserPermissions.level < 3) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

        } else if (subcommand === "delete") {
            if (actualUserPermissions.level < 3) return message.error(this.client.functions.error("perms", { permission: 3 }, actualUserPermissions));

        }
    }
};
