const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Change or set a reason for a case in moderation logs.",
            usage: "reason <case-id|'latest'> [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, response, permissionLevel) {
        if (!message.guild.settings.logs.moderation) return response.error("You must have moderation logs enabled to use this command.");

        const args = /reason\s+(\d+|latest)(?:\s+(.+))/i.exec(message.content);
        if (!args) return response.usage(this);

        const id = args[1], reason = args[2];

        this.client.modlogsManager.fetchCase(message.guild, id).then(log => {
            if (!log) return response.error(`There are no moderation logs under the given case ID.`);

            this.client.modlogsManager.editReason(log, message.author, reason).then(
                () => response.reply("Successfully updated the case.").then(msg => { msg.delete({ timeout: 2500 }); message.delete({ timeout: 2500 }); })
            ).catch(err => response.error(`An error occured while updating the given case.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
        }).catch(err => {
            response.error(`An error occured while fetching the requested case.`);
        });
    }
};
