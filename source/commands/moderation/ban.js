const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Ban a member from the server.",
            usage: "ban <@user> [time:xd(ays) xh(ours) xm(inutes) xs(seconds)] [purge-days] [reason]",
            permission: Constants.Permissions.Levels.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(?:(\d+)\s*d(?:ays?)?)?\s?(?:(\d+)\s*h(?:ours?|rs?)?)?\s?(?:(\d+)\s*m(?:inutes?|in)?)?\s?(?:(\d+)\s*s(?:econds?|ec)?)?)?(?:\s+(\d+))?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const user = args[1], days = args[2], hours = args[3], minutes = args[4], seconds = args[5], purgeDays = args[6] || 0, reason = args[7];
        const time = ((60 * 60 * 24 * (days ? Number(days) : 0)) + (60 * 60 * (hours ? Number(hours) : 0)) + (60 * (minutes ? Number(minutes) : 0)) + (seconds ? Number(seconds) : 0)) * 1000;

        if (time > (1000 * 60 * 60 * 24 * 7)) return message.error("You cannot ban a user for more than a week.");

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser).catch(err => { return; });

            if (member && message.member.roles.highest.position <= member.roles.highest.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return message.error(`You cannot ban a user with either the same or higher highest role.`);
            if (member && !member.bannable) return message.error(`In order to complete the request, I need the **BAN_MEMBERS** permission and my highest role needs to be higher than the requested user's highest role.`);

            const toBan = cachedUser || user;

            const log = { "moderator": message.author };
            if (reason) Object.assign(log, { reason });

            this.client.caches.bans.set(toBan.id || toBan, log);

            if (cachedUser) {
                const embed = cachedUser.buildEmbed().setColor(0xff0000).setFooter("TypicalBot", Constants.Links.ICON).setTitle("TypicalBot Alert System").setDescription(`You have been banned from **${message.guild.name}**.`).addField("» Moderator", message.author.tag);
                if (reason) embed.addField("» Reason", reason);
                embed.send().catch(err => { return; });
            }

            message.guild.members.ban(toBan, { days: purgeDays, reason: `Banned by ${message.author.tag} | Reason: ${reason || "No reason provided."}` }).then(actioned => {
                if (time) this.client.handlers.tasks.create("unban", Date.now() + time, { guild: message.guild.id, user: member.id });

                message.success(`Successfully banned user \`${actioned.tag || actioned.id || actioned}\`.`);
            }).catch(err => {
                if (err === "Error: Couldn't resolve the user ID to ban.") return message.error(`The requested user could not be found.`);

                message.error(`An error occured while trying to ban the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err.stack}\`\`\`` : ""}`);

                this.client.caches.bans.delete(toBan.id || toBan);
            });
        }).catch(err => message.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err.stack}\`\`\`` : ""}`));
    }
};
