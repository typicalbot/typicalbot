const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Unmute a member in the server.",
            usage: "unmute <@user> [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const user = args[1], purgeDays = args[2] || 0, reason = args[3];

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser).catch(err => { return; });

            if (member && message.member.highestRole.position <= member.highestRole.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return message.error(`You cannot unmute a user with either the same or higher highest role.`);
            if (!message.guild.settings.roles.mute) return message.error(`No mute role has been set. Try \`$set edit muterole <role-name>\``);
            //if (member && !member.bannable) return message.error(`In order to complete the request, I need the **MANAGE ROLES** permission and my highest role needs to be higher than the requested user's highest role.`);
            if (member && !message.guild.settings.roles.mute.editable) return message.error(`In order to complete the request, I need the **MANAGE ROLES** permission. Also, my highest role needs to be higher than the requested user's highest role and the mute role.`);
            if (member.roles.get(message.guild.settings.roles.mute.id)) {
                member.removeRole(message.guild.settings.roles.mute).then(async actioned => {
                    if (message.guild.settings.logs.moderation) {
                        const log = { "action": "unmute", "user": member.user, "moderator": message.author };
                        if (reason) Object.assign(log, { reason });

                        await this.client.modlogsManager.createLog(message.guild, log);

                        message.success(`Successfully unmuted user \`${member.user.tag}\`.`);
                    } else return message.success(`Successfully unmuted user **${member.user.tag}**.`);
                }).catch(err => {
                    message.error(`An error occured while trying to unmute the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`);
                });





                const log = { "moderator": message.author };
                if (reason) Object.assign(log, { reason });

                if (cachedUser) {
                    const embed = cachedUser.buildEmbed().setColor(0x006699).setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png").setTitle("TypicalBot Alert System").setDescription(`You have been unmuted in **${message.guild.name}**.`).addField("» Moderator", message.author.tag);
                    if (reason) embed.addField("» Reason", reason);
                    embed.send().catch(err => { return; });
                }
            } else return message.error('The requested user is not muted.');
        }).catch(err => message.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
