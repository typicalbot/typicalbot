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
                    this.client.emit("guildInvitePosted", response.message.guild, response.message, response.message.author);
                    response.message.delete().then(() => {
                        response.error(`This server prohibits invites from being sent. Your message has been deleted.`);
                    });
                }
            }
        });
    }
};
