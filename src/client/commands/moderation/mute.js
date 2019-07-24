const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Mute a member in the server.",
            usage: "mute <@user> [time:xd(ays) xh(ours) xm(inutes) xs(seconds)] [reason]",
            permission: Constants.Permissions.Levels.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:(?:<@!?)?(\d{17,20})>?(?:\s+(?:(\d+)d(?:ays?)?)?\s?(?:(\d+)h(?:ours?|rs?)?)?\s?(?:(\d+)m(?:inutes?|in)?)?\s?(?:(\d+)s(?:econds?|ec)?)?)?(?:\s*(.+))?|(deny)\s+(?:(here)|(?:(?:<#)?(\d{17,20})>?)))/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        if (args[7]) {
            if (!message.guild.settings.roles.mute || !message.guild.roles.has(message.guild.settings.roles.mute)) return message.error(`No mute role has been set. Try \`$set edit muterole <role-name>\``);
            
            const channel = args[8] ? message.channel : message.guild.channels.get(args[9]);
            if (!channel) return message.error("The channel given doesn't exist.");

            if (!channel.memberPermissions(message.guild.member(this.client.user)).has("MANAGE_PERMISSIONS")) return message.error("I cannot manage permissions for this channel.");

            const role = message.guild.roles.get(message.guild.settings.roles.mute);

            channel.overwritePermissions({
                permissionOverwrites: [
                    channel.permissionOverwrites,
                    {
                        id: role.id,
                        deny: [ "SEND_MESSAGES" ],
                        type: "role"
                    }
                ],
                reason: "Denying permissions for muted users to speak."
            }).then(() => {
                message.success("Denied permissions for muted users to speak!");
            }).catch(err => {
                message.error("Could not deny permission for muted users to speak.");
            });
        } else {
            const user = args[1], days = args[2], hours = args[3], minutes = args[4], seconds = args[5], reason = args[6];
            const time = ((60 * 60 * 24 * (days ? Number(days) : 0)) + (60 * 60 * (hours ? Number(hours) : 0)) + (60 * (minutes ? Number(minutes) : 0)) + (seconds ? Number(seconds) : 0)) * 1000;

            if (time > (1000 * 60 * 60 * 24 * 7)) return message.error("You cannot mute a user for more than a week.");

            this.client.users.fetch(user).then(async cachedUser => {
                const member = await message.guild.members.fetch(cachedUser);
                if (!member) return message.error(`The requested user could not be found.`);

                if (!message.guild.settings.roles.mute || !message.guild.roles.has(message.guild.settings.roles.mute)) return message.error(`No mute role has been set. Try \`$set edit muterole <role-name>\``);

                if (member.roles.has(message.guild.settings.roles.mute)) return message.error("The requested user is already muted.");

                if (message.member.roles.highest.position <= member.roles.highest.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return message.error(`You cannot mute a user with either the same or higher highest role.`);

                const role = message.guild.roles.get(message.guild.settings.roles.mute);
                if (!role.editable) return message.error(`In order to complete the request, I need the **MANAGE ROLES** permission. Also, my highest role needs to be higher than the requested user's highest role and the mute role.`);

                const embed = cachedUser.buildEmbed().setColor(Constants.ModerationLog.Types.MUTE.hex).setFooter("TypicalBot", Constants.Links.ICON).setTitle("TypicalBot Alert System").setDescription(`You have been muted in **${message.guild.name}**.`).addField("» Moderator", message.author.tag);
                if (reason) embed.addField("» Reason", reason);
                embed.send().catch(err => { return; });

                member.roles.add(role).then(async actioned => {
                    if (message.guild.settings.logs.moderation) {
                        const newCase = this.client.handlers.moderationLog.buildCase(message.guild).setExpiration(time).setAction(Constants.ModerationLog.Types.MUTE).setModerator(message.author).setUser(member.user);
                        if (reason) newCase.setReason(reason); newCase.send();

                        if (time) this.client.handlers.tasks.create("unmute", Date.now() + time, { guild: message.guild.id, member: member.id });

                        message.success(`Successfully muted user \`${member.user.tag}\`.`);
                    } else return message.success(`Successfully muted user **${member.user.tag}**.`);
                }).catch(err => {
                    message.error(`An error occured while trying to mute the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`);
                });
            }).catch(err => message.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
        }
    }
};
