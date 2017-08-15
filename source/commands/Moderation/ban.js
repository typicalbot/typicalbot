const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "ban",
            description: "Ban a member from the server.",
            usage: "ban <@user> [purge-days] [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, response, permissionLevel) {
        const match = /ban\s+(?:<@!?)?(\d+)>?(?:\s+(.+))?/i.exec(message.content);
        if (!match) return response.usage(this);

        this.client.fetchUser(match[1]).then(user => {
            const member = message.guild.member(user);
            if (!member) return response.error(`User not found.`);

            if (message.member.highestRole.position <= member.highestRole.position) return response.error(`You cannot ban a user with either the same or higher highest role.`);
            if (!member.bannable) return response.error(`I cannot ban that user.`);

            member.ban().then(async () =>  {
                if (message.guild.settings.modlogs) {
                    const _case = await this.client.modlogsManager.createLog(message.guild,
                        match[2] ? {
                            action: "ban",
                            user: member.user,
                            reason: match[2],
                            moderator: message.author
                        } : {
                            action: "ban",
                            user: member.user,
                            moderator: message.author
                        }
                    );
                    response.success(`Successfully banned user \`${member.user.tag}\` and created case #${_case}${match[2] ? ` with reason \`${match[2]}\`` : ""}.`);
                } else return response.success(`Successfully banned user \`${member.user.tag}\`.`);
            }).catch(err => response.error(`An error occured:\n\n${err}`));
        }).catch(err => response.error(`An error occured:\n\n${err}`));
    }
};
