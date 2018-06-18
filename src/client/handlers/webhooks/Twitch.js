const config = require(`${process.cwd()}/config`);
const snekfetch = require("snekfetch");

class TwitchWebhookHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
    }

    async lookup(login) {
        const { body } = await snekfetch
            .get(`https://api.twitch.tv/helix/users?login=${login}`)
            .set("Client-ID", config.apis.twitch.client_id)
            .catch(() => null);

        if (!body || !body.data.length) throw "Couldn't find user.";

        return body.data[0];
    }

    async subscribe(guild, twitchChannel) {
        snekfetch.post("https://api.twitch.tv/helix/webhooks/hub")
            .send({

            });

    }
}

module.exports = TwitchWebhookHandler;
