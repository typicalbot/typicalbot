const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name) {
        super(client, name, {
            description: "Softban a member from the server.",
            usage: "softban <@user> [purge-days] [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, response, permissionLevel) {
        const args = /softban\s+(?:<@!?)?(\d{17,20})>?(?:\s+(\d+))?(?:\s+(.+))?/i.exec(message.content);
        if (!args) return response.usage(this);

        const user = args[1], days = args[2] || 2, reason = args[3];

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser);
            if (!member) return response.error(`The requested user could not be found.`);

            if (message.member.highestRole.position <= member.highestRole.position) return response.error(`You cannot softban a user with either the same or higher highest role.`);
            if (!member.bannable) return response.error(`In order to complete the request, I need the **BAN_MEMBERS** permission and my highest role needs to be higher than the requested user's highest role.`);

            this.client.softbanCache.set(user.id || user, user.id || user);

            member.ban({ days }).then(actioned => {
                setTimeout(() => {
                    message.guild.unban(actioned.id).then(async () => {
                        if (message.guild.settings.logs.moderation) {
                            const log = { "action": "softban", "user": actioned.user, "moderator": message.author };
                            if (reason) Object.assign(log, { reason });

                            await this.client.modlogsManager.createLog(message.guild, log);

                            response.success(`Successfully softbanned user \`${actioned.user.tag}\`.`);
                        } else return response.success(`Successfully softbanned user **${member.user.tag}**.`);
                    });
                }, 1000);
            }).catch(err => response.error(`An error occured while trying to softban the requested user.`));
        }).catch(err => response.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
