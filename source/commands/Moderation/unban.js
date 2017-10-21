const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, name, path) {
        super(client, name, path, {
            description: "Ban a member from the server.",
            usage: "unban <user-id> [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, response, permissionLevel) {
        const args = /unban\s+(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(message.content);
        if (!args) return response.usage(this);

        const user = args[1], reason = args[2];

        this.client.users.fetch(user).then(async cachedUser => {
            const log = { "moderator": message.author };
            if (reason) Object.assign(log, { reason });

            this.client.unbanCache.set(user, log);

            message.guild.unban(cachedUser.id).then(actioned => {
                response.success(`Successfully unbanned user \`${actioned.tag || actioned}\`.`);
            }).catch(err => {
                if (err === "Error: Couldn't resolve the user ID to unban.") return response.error(`The requested user could not be found.`);

                response.error(`An error occured while trying to unban the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`);

                this.client.unbanCache.delete(cachedUser.id || cachedUser);
            });
        }).catch(err => response.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
