const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Unmute a member in the server.",
            usage: "unmute <@user> [reason]",
            permission: Constants.Permissions.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const user = args[1], purgeDays = args[2] || 0, reason = args[3];

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser);
            if (!member) return message.error(`The requested user could not be found.`);

            if (!message.guild.settings.roles.mute || !message.guild.roles.has(message.guild.settings.roles.mute)) return message.error(`No mute role has been set. Try \`$set edit muterole <role-name>\``);

            if (!member.roles.has(message.guild.settings.roles.mute)) return message.error("The requested user is not muted.");

            if (message.member.highestRole.position <= member.highestRole.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return message.error(`You cannot mute a user with either the same or higher highest role.`);

            const role = message.guild.roles.get(message.guild.settings.roles.mute);
            if (!role.editable) return message.error(`In order to complete the request, I need the **MANAGE ROLES** permission. Also, my highest role needs to be higher than the requested user's highest role and the mute role.`);

            const embed = cachedUser.buildEmbed().setColor(0xFF9900).setFooter("TypicalBot", Constants.Links.ICON).setTitle("TypicalBot Alert System").setDescription(`You have been muted in **${message.guild.name}**.`).addField("» Moderator", message.author.tag);
            if (reason) embed.addField("» Reason", reason);
            embed.send().catch(err => { return; });

            member.removeRole(role).then(async actioned => {
                if (message.guild.settings.logs.moderation) {
                    const newCase = this.client.handlers.moderationLog.buildCase(message.guild).setAction(Constants.ModerationLog.Types.UNMUTE).setModerator(message.author).setUser(member.user);
                    if (reason) newCase.setReason(reason); newCase.send();

                    this.client.handlers.tasks.clear("unmute", member);

                    message.success(`Successfully unmuted user \`${member.user.tag}\`.`);
                } else return message.success(`Successfully unmuted user **${member.user.tag}**.`);
            }).catch(err => {
                message.error(`An error occured while trying to unmute the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`);
            });
        }).catch(err => message.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
