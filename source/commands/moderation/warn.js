const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Warn a member in the server.",
            usage: "warn <@user> [reason]",
            mode: "strict",
            permission: 2
        });
    }

    async execute(message, parameters, permissionLevel) {
        if (!message.guild.settings.logs.moderation) return message.error("You must have moderation logs enabled to use this command.");

        const args = /(?:<@!?)?(\d{17,20})>?(?:\s+(.+))?/i.exec(parameters);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const user = args[1], reason = args[2];

        this.client.users.fetch(user).then(async cachedUser => {
            const member = await message.guild.members.fetch(cachedUser);
            if (!member) return message.error(`The requested user could not be found.`);

            if (message.member.highestRole.position <= member.highestRole.position && (permissionLevel.level !== 4 && permissionLevel.level < 9))  return message.error(`You cannot warn a user with either the same or higher highest role.`);

            const log = { "action": "warn", "user": member.user, "moderator": message.author };
            if (reason) Object.assign(log, { reason });

            const _case = await this.client.modlogsManager.createLog(message.guild, log);

            const embed = cachedUser.buildEmbed().setColor(0xff0000).setFooter("TypicalBot", "https://typicalbot.com/x/images/icon.png").setTitle("TypicalBot Alert System").setDescription(`You have been warned in **${message.guild.name}**.`).addField("» Moderator", message.author.tag);
            if (reason) embed.addField("» Reason", reason);
            embed.send().catch(err => { return; });

            message.success(`Successfully warned user \`${cachedUser.tag}\`.`);
        }).catch(err => message.error(`An error occured while trying to fetch the requested user.${message.author.id === "105408136285818880" ? `\n\n\`\`\`${err}\`\`\`` : ""}`));
    }
};
