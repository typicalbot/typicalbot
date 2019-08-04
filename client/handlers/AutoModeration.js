const { inspect } = require("util");

class AutoModerationHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    invite(message) {
        if (message.guild.settings.automod.invite) {
            if (
                /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(message.content) ||
                /(https:\/\/)?(www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/([a-z0-9-.]+)?/i.test(inspect(message.embeds, { depth: 4 }))
            ) this.client.emit("guildInvitePosted", message);
        }
    }
}

module.exports = AutoModerationHandler;