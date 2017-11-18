const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Ban a member from the server.",
            usage: "ban <@user> [purge-days] [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, permissionLevel) {
        const args = /ban\s+(?:<@!?)?(\d{17,20})>?(?:\s+(\d+))?(?:\s+(.+))?/i.exec(message.content);
        if (!args) return response.usage(this);

        const user = args[1], purgeDays = args[2] || 0, reason = args[3];

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser).catch(err => { return; });

            if (member && message.member.highestRole.position <= member.highestRole.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return response.error(`You cannot ban a user with either the same or higher highest role.`);
            if (member && !member.bannable) return response.error(`In order to complete the request, I need the **BAN_MEMBERS** permission and my highest role needs to be higher than the requested user's highest role.`);

            const toBan = cachedUser || user;

            const log = { "moderator": message.author };
            if (reason) Object.assign(log, { reason });

            this.client.banCache.set(toBan.id || toBan, log);

            if (cachedUser) {
                const embed = cachedUser.buildEmbed().setColor(0xff0000).setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png").setTitle("TypicalBot Alert System").setDescription(`You have been banned from **${message.guild.name}**.`).addField("» Moderator", message.author.tag);
                if (reason) embed.addField("» Reason", reason);
                embed.send().catch(err => { return; });
            }

            message.guild.ban(toBan, { days: purgeDays }).then(actioned => {
                response.success(`Successfully banned user \`${actioned.tag || actioned.id || actioned}\`.`);
            }).catch(err => {
                if (err === "Error: Couldn't resolve the user ID to ban.") return response.error(`The requested user could not be found.`);

                response.error(`An error occured while trying to ban the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`);

                this.client.banCache.delete(toBan.id || toBan);
            });
        }).catch(err => response.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
