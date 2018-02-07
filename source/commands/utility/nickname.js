const Command = require("../../structures/Command");
const Constants = require(`../../utility/Constants`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Change or clear either your nickname or another user's nickname.",
            usage: "nickname [@user] [nickname]",
            aliases: ["nick"],
            mode: Constants.Modes.LITE
        });
    }

    async execute(message, parameters, permissionLevel) {
        const args = /(?:<@!?(\d{17,20})>\s+)?(?:(.{1,32}))?/i.exec(parameters);

        const member = args[1] ? await message.guild.members.fetch(args[1]) : null;
        const nickname = args[2];
        const reset = !nickname || nickname === "reset";

        if (member) {
            const actualUserPermissions = this.client.handlers.permissions.fetch(message.guild, message.author, true);
            if (actualUserPermissions.level < 2) return message.error(this.client.functions.error("perms", { permission: 2 }, actualUserPermissions));

            member.setNickname(reset ? "" : nickname)
                .then(() => message.reply(`Successfully ${reset ? "reset" : "changed"} member's nickname.`))
                .catch(err => message.error("An error occured. This most likely means I cannot manage member's nickname."));
        } else {
            if (message.guild.settings.nonickname) return message.error(`This command is currently disabled. Disable the \`nonickname\` setting to enable this command.`);

            message.member.setNickname(reset ? "" : nickname)
                .then(() => message.reply(`Successfully ${reset ? "reset" : "changed"} your nickname.`))
                .catch(err => message.error("An error occured. This most likely means I cannot manage your nickname."));
        }
    }
};
