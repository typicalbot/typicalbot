const Constants = require("../utility/Constants");
const Event = require("../structures/Event");
const { inspect } = require("util");

class MessageUpdate extends Event {
    constructor(...args) {
        super(...args);
    }

    async execute(oldMessage, message) {
        if (message.channel.type !== "text" || message.author.bot || !message.guild || !message.guild.available || message.partial) return;

        const settings = message.guild.settings = await message.guild.fetchSettings();

        const userPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author);

        if (userPermissions.level >= 2) return;
        if (settings.ignored.invites.includes(message.channel.id)) return;

        if (userPermissions.level < Constants.Permissions.Levels.SERVER_MODERATOR && !settings.ignored.invites.includes(message.channel.id))
            this.inviteCheck(message);
    }

    inviteCheck(message) {
        if (message.guild.settings.automod.invite) {
            if (
                /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(message.content) ||
                /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(inspect(message.embeds, { depth: 4 }))
            ) this.client.emit("guildInvitePosted", message);
        }
    }
}

module.exports = MessageUpdate;
