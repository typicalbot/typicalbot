const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Kick a member from the server.',
            usage: 'kick <@user> [reason]',
            permission: Constants.Permissions.Levels.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT,
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const user = args[1]; const
            reason = args[2];

        this.client.users.fetch(user).then(async (cachedUser) => {
            const member = await message.guild.members.fetch(cachedUser);
            if (!member) return message.error('The requested user could not be found.');

            if (message.member.roles.highest.position <= member.roles.highest.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return message.error('You cannot kick a user with either the same or higher highest role.');
            if (!member.kickable) return message.error('In order to complete the request, I need the **KICK_MEMBERS** permission and my highest role needs to be higher than the requested user\'s highest role.');

            const embed = cachedUser.buildEmbed().setColor(0xff0000).setFooter('TypicalBot', Constants.Links.ICON).setTitle('TypicalBot Alert System')
                .setDescription(`You have been kicked from **${message.guild.name}**.`)
                .addField('» Moderator', message.author.tag);
            if (reason) embed.addField('» Reason', reason);
            embed.send().catch((err) => { });

            member.kick(`Kicked by ${message.author.tag} | Reason: ${reason || 'No reason provided.'}`).then(async (actioned) => {
                if (message.guild.settings.logs.moderation) {
                    const newCase = this.client.handlers.moderationLog.buildCase(message.guild).setAction(Constants.ModerationLog.Types.KICK).setModerator(message.author).setUser(member.user);
                    if (reason) newCase.setReason(reason); newCase.send();

                    message.success(`Successfully kicked user \`${member.user.tag}\`.`);
                } else return message.success(`Successfully kicked user **${member.user.tag}**.`);
            }).catch((err) => message.error(`An error occured while trying to kick the requested user.${message.author.id === '105408136285818880' ? `\n\n\`\`\`${err}\`\`\`` : `\n\n\`\`\`${err}\`\`\``}`));
        }).catch((err) => message.error(`An error occured while trying to fetch the requested user.${message.author.id === '105408136285818880' ? `\n\n\`\`\`${err}\`\`\`` : `\n\n\`\`\`${err}\`\`\``}`));
    }
};
