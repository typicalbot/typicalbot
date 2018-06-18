const config = require(`${process.cwd()}/config`);
const snekfetch = require("snekfetch");

class TwitchWebhookHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    async subscribe(guild, twitchChannel) {
        snekfetch.post("https://api.twitch.tv/helix/webhooks/hub")
            .send({

            });
            
    }
}

module.exports = TwitchWebhookHandler;
