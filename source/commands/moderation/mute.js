const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Mute a member in the server.",
            usage: "mute <@user> [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(?:(\d+)\s*d(?:ays)?)?\s*(?:(\d+)\s*h(?:ours|rs|r)?)?\s*(?:(\d+)\s*m(?:inutes|in)?)?\s*(?:(\d+)\s*s(?:econds|ec)?))?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const user = args[1], days = args[2], hours = args[3], minutes = args[4], seconds = args[5], reason = args[6];
        const time = ((60 * 60 * 24 * (days ? Number(days) : 0)) + (60 * 60 * (hours ? Number(hours) : 0)) + (60 * (minutes ? Number(minutes) : 0)) + (seconds ? Number(seconds) : 0)) * 1000;

        if (time > (1000 * 60 * 60 * 24 * 7)) return message.error("You cannot mute a user for more than a week.");

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser);
            if (!member) return message.error(`The requested user could not be found.`);

            if (!message.guild.settings.roles.mute || !message.guild.roles.has(message.guild.settings.roles.mute)) return message.error(`No mute role has been set. Try \`$set edit muterole <role-name>\``);

            if (member.roles.has(message.guild.settings.roles.mute)) return message.error("The requested user is already muted.");

            if (message.member.highestRole.position <= member.highestRole.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return message.error(`You cannot mute a user with either the same or higher highest role.`);

            const role = message.guild.roles.get(message.guild.settings.roles.mute);
            if (!role.editable) return message.error(`In order to complete the request, I need the **MANAGE ROLES** permission. Also, my highest role needs to be higher than the requested user's highest role and the mute role.`);

            const embed = cachedUser.buildEmbed().setColor(0xFF9900).setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png").setTitle("TypicalBot Alert System").setDescription(`You have been muted in **${message.guild.name}**.`).addField("» Moderator", message.author.tag);
            if (reason) embed.addField("» Reason", reason);
            embed.send().catch(err => { return; });

            member.addRole(role).then(async actioned => {
                if (message.guild.settings.logs.moderation) {
                    const log = { "action": "mute", "user": member.user, "moderator": message.author, "length": time };
                    if (reason) Object.assign(log, { reason });

                    await this.client.modlogsManager.createLog(message.guild, log);

                    if (time) this.client.timers.get("mutes").create(member, Date.now() + time);

                    message.success(`Successfully muted user \`${member.user.tag}\`.`);
                } else return message.success(`Successfully muted user **${member.user.tag}**.`);
            }).catch(err => {
                message.error(`An error occured while trying to mute the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`);
            });
        }).catch(err => message.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
