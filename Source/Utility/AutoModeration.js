const { inspect } = require("util");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    inviteCheck(message) {
        return new Promise((resolve, reject) => {
            if (message.guild.settings.automod.invite) {
                const contentMatch = this.client.functions.inviteCheck(message.content);
                const embedMatch = this.client.functions.inviteCheck(inspect(message.embeds, { depth: 4 }));

                if (contentMatch || embedMatch) {
                    if (!message.deletable) return reject("`message.disable` returned false");

                    this.client.eventsManager.guildInvitePosted(message.guild, message, message.author);
                    message.delete().then(() => {
                        return resolve();
                    });
                }
            } else { return reject("`automod.invite` returned false"); }
        });
    }
};
