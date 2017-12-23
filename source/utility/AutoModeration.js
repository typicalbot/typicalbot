const { inspect } = require("util");

module.exports = class {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    inviteCheck(message) {
        return new Promise((resolve, reject) => {
            if (message.guildSettings.automod.invite) {
                const contentMatch = this.client.functions.inviteCheck(message.content);
                const embedMatch = this.client.functions.inviteCheck(inspect(message.embeds, { depth: 4 }));

                if (contentMatch || embedMatch) {
                    this.client.emit("guildInvitePosted", message.guild, message, message.author);
                    message.delete().then(() => {
                        message.error(`This server prohibits invites from being sent. Your message has been deleted.`);
                    });
                }
            }
        });
    }
};
