const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Change or set a reason for a case in moderation logs.",
            usage: "reason <case-id|'latest'> [reason]",
            permission: Constants.Permissions.SERVER_MODERATOR,
            mode: Constants.Modes.STRICT
        });
    }

    async execute(message, parameters, permissionLevel) {
        if (!message.guild.settings.logs.moderation) return message.error("You must have moderation logs enabled to use this command.");

        const args = /(\d+|latest)(?:\s+(.+))/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const id = args[1], reason = args[2];

        this.client.moderationLog.fetchCase(message.guild, id).then(log => {
            if (!log) return message.error(`There are no moderation logs under the given case ID.`);

            this.client.moderationLog.edit(log, message.author, reason).then(
                () => message.reply("Successfully updated the case.").then(msg => { msg.delete({ timeout: 2500 }); message.delete({ timeout: 2500 }); })
            ).catch(err => message.error(`An error occured while updating the given case.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
        }).catch(err => {
            message.error(`An error occured while fetching the requested case.`);
        });
    }
};
