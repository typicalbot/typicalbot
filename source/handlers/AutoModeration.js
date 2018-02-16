const { inspect } = require("util");

class AutoModerationHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    inviteCheck(message) {
        return new Promise((resolve, reject) => {
            if (message.guild.settings.automod.invite) {
                const contentMatch = this.client.functions.inviteCheck(message.content);
                const embedMatch = this.client.functions.inviteCheck(inspect(message.embeds, { depth: 4 }));

                if (contentMatch || embedMatch) {
                    this.client.emit("guildInvitePosted", message);
                    /*message.delete().then(() => {
                        message.error(`This server prohibits invites from being sent. Your message has been deleted.`);
                    });*/
                }
            }
        });
    }
}

module.exports = AutoModerationHandler;