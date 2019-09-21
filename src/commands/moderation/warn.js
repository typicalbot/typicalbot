const Command = require('../../structures/Command');

const Constants = require('../../utility/Constants');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Warn a member in the server.',
            usage: 'warn <@user> [reason]',
            permission: Constants.Permissions.Levels.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT,
        });
    }

    async execute(message, parameters, permissionLevel) {
        if (!message.guild.settings.logs.moderation) return message.error('You must have moderation logs enabled to use this command. You can configure this setting by using `$settings edit modlogs <channel-name|channel-id|channel-mention>`.');

        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error('usage', this));

        const user = args[1]; const
            reason = args[2];

        this.client.users.fetch(user).then(async (cachedUser) => {
            const member = await message.guild.members.fetch(cachedUser);
            if (!member) return message.error('The requested user could not be found.');

            if (message.member.roles.highest.position <= member.roles.highest.position && (permissionLevel.level !== 4 && permissionLevel.level < 9)) return message.error('You cannot warn a user with either the same or higher highest role.');

            const newCase = this.client.handlers.moderationLog.buildCase(message.guild).setAction(Constants.ModerationLog.Types.WARN).setModerator(message.author).setUser(member.user);
            if (reason) newCase.setReason(reason); newCase.send();

            const embed = cachedUser.buildEmbed().setColor(Constants.ModerationLog.Types.WARN.hex).setFooter('TypicalBot', Constants.Links.ICON).setTitle('TypicalBot Alert System')
                .setDescription(`You have been warned in **${message.guild.name}**.`)
                .addField('» Moderator', message.author.tag);
            if (reason) embed.addField('» Reason', reason);
            embed.send().catch((err) => { });

            message.success(`Successfully warned user \`${cachedUser.tag}\`.`);
        }).catch((err) => message.error(`An error occured while trying to fetch the requested user.${message.author.id === '105408136285818880' ? `\n\n\`\`\`${err}\`\`\`` : ''}`));
    }
};
