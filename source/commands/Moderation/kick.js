const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "kick",
            description: "Kick a member from the server.",
            usage: "kick <@user> [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, response, permissionLevel) {
        const args = /kick\s+(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(message.content);
        if (!args) return response.usage(this);

        const user = args[1], reason = args[2];

        this.client.fetchUser(user).then(async cachedUser => {
            const member = await message.guild.fetchMember(cachedUser);
            if (!member) return response.error(`The requested user could not be found.`);

            if (message.member.highestRole.position <= member.highestRole.position) return response.error(`You cannot kick a user with either the same or higher highest role.`);
            if (!member.kickable) return response.error(`In order to complete the request, I need the **KICK_MEMBERS** permission and my highest role needs to be the requested user's highest role.`);

            member.kick().then(async actioned =>  {
                if (message.guild.settings.logs.moderation) {
                    const log = { "action": "kick", "user": member.user, "moderator": message.author };
                    if (reason) Object.assign(log, { reason });

                    const _case = await this.client.modlogsManager.createLog(message.guild, log);
                    response.success(`Successfully kicked user \`${actioned.user.tag}\`.`);
                } else return response.success(`Successfully kicked user **${member.user.tag}**.`);
            }).catch(err => response.error(`An error occured while trying to kick the requested user.`));
        }).catch(err => response.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
