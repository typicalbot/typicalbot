const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "nickname",
            description: "Change or clear either your nickname or another user's nickname.",
            aliases: ["nick"],
            usage: "nickname [@user] [nickname]",
            mode: "lite"
        });
    }

    async execute(message, response, permissionLevel) {
        const args = /nick(?:name)?(?:\s+(?:<@!?)?(\d{17,20})>?)?(?:\s+(.{1,32}))?/i.exec(message.content);

        const member = args[1] ? await message.guild.fetchMember(args[1]) : null;
        const nickname = args[2];
        const reset = !nickname || nickname === "reset";

        if (member) {
            const actualUserPermissions = this.client.permissionsManager.get(message.guild, message.author, true);
            if (actualUserPermissions.level < 2) return response.perms({ permission: 2 }, actualUserPermissions);

            member.setNickname(reset ? "" : nickname)
                .then(() => response.reply(`Successfully ${reset ? "reset" : "changed"} member's nickname.`))
                .catch(err => response.error("An error occured. This most likely means I cannot manage member's nickname."));
        } else {
            if (message.guild.settings.nonickname) return response.error(`This command is currently disabled. Disable the \`nonickname\` setting to enable this command.`);

            message.member.setNickname(reset ? "" : nickname)
                .then(() => response.reply(`Successfully ${reset ? "reset" : "changed"} your nickname.`))
                .catch(err => response.error("An error occured. This most likely means I cannot manage your nickname."));
        }
    }
};
