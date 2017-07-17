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
        const match = /kick\s+(?:<@!?)?(\d+)>?(?:\s+(.+))?/i.exec(message.content);
        if (!match) return response.usage(this);

        this.client.fetchUser(match[1]).then(user => {
            const member = message.guild.member(user);
            if (!member) return response.error(`User not found.`);

            if (message.member.highestRole.position <= member.highestRole.position) return response.error(`You cannot kick a user with either the same or higher highest role.`);
            if (!member.kickable) return response.error(`I cannot kick that user.`);

            member.kick().then(async () =>  {
                if (message.guild.settings.modlogs) {
                    const _case = await this.client.modlogsManager.createLog(message.guild,
                        match[2] ? {
                            action: "kick",
                            user: member.user,
                            reason: match[2],
                            moderator: message.author
                        } : {
                            action: "kick",
                            user: member.user,
                            moderator: message.author
                        }
                    );
                    response.success(`Successfully kicked user \`${member.user.tag}\` and created case #${_case}${match[2] ? ` with reason \`${match[2]}\`` : ""}.`);
                } else return response.success(`Successfully kicked user \`${member.user.tag}\`.`);
            }).catch(err => response.error(`An error occured:\n\n${err}`));
        }).catch(err => response.error(`An error occured:\n\n${err}`));
    }
};
