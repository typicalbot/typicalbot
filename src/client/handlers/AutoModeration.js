const { inspect } = require("util");

class AutoModerationHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    invite(message) {
        if (message.guild.settings.automod.invite) {
            if (
                this.client.functions.inviteCheck(message.content) ||
                this.client.functions.inviteCheck(inspect(message.embeds, { depth: 4 }))
            ) this.client.emit("guildInvitePosted", message);
        }
    }
}

module.exports = AutoModerationHandler;