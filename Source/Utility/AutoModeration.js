const { inspect } = require("util");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    inviteCheck(response) {
        return new Promise((resolve, reject) => {
            if (response.message.guild.settings.automod.invite) {
                const contentMatch = this.client.functions.inviteCheck(response.message.content);
                const embedMatch = this.client.functions.inviteCheck(inspect(response.message.embeds, { depth: 4 }));

                if (contentMatch || embedMatch) {
                    this.client.eventsManager.guildInvitePosted(response.message.guild, response.message, response.message.author);
                    response.message.delete().then(() => {
                        response.error(`An invite was detected in your message. Your message has been deleted.`);
                    });
                }
            }
        });
    }
};
