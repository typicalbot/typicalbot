const Command = require("../../structures/Command");
const Constants = require("../../utility/Constants");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Kick a member from a voice channel.",
            usage: "voicekick <@user> [reason]",
            permission: Constants.Permissions.Levels.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const user = args[1], reason = args[2];

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser);

            if (!member) return message.error(`The requested user could not be found.`);
            if (!member.voice.channel) return message.error(`The requested user is not in a voice channel.`);

            member.voice.setChannel(null, (reason || "No reason provided.")).then(async actioned => {
                if (message.guild.settings.logs.moderation) {
                    const newCase = this.client.handlers.moderationLog.buildCase(message.guild).setAction(Constants.ModerationLog.Types.VOICE_KICK).setModerator(message.author).setUser(member.user);
                    if (reason) newCase.setReason(reason); newCase.send();

                    message.success(`Successfully voice kicked user \`${member.user.tag}\`.`);
                } else return message.success(`Successfully voice kicked user **${member.user.tag}**.`);
            });
        }).catch(err => message.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : `\n\n\`\`\`${err}\`\`\``}`));
    }
};
