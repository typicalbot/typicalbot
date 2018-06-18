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

    async subscribe(id) {
        await snekfetch
            .post("https://api.twitch.tv/helix/webhooks/hub")
            .set("Content-Type", "application/json")
            .set("Client-ID", config.apis.twitch.client_id)
            .send({
                "hub.callback": `http://webhook.typicalbot.com:${this.client.build === "stable" ? 5000 : this.client.build === "beta" ? 5001 : this.client.build === "development" ? 5002 : 5000}/webhook`,
                "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${id}`,
                "hub.mode": "subscribe",
                "hub.lease_seconds": 864000
            })
            .catch(err => { throw "Could not subscribe"; });
    }

    async unsubscribe(id) {
        await snekfetch
            .post("https://api.twitch.tv/helix/webhooks/hub")
            .set("Content-Type", "application/json")
            .set("Client-ID", config.apis.twitch.client_id)
            .send({
                "hub.callback": `http://webhook.typicalbot.com:${this.client.build === "stable" ? 5000 : this.client.build === "beta" ? 5001 : this.client.build === "development" ? 5002 : 5000}/webhook`,
                "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${id}`,
                "hub.mode": "unsubscribe",
                "hub.lease_seconds": 0
            })
            .catch(err => { throw "Could not subscribe"; });
    }

    async fetchSubscriptions(guild) {
        const subscriptions = await this.client.database.connection.table("webhooks").get(guild.id);

        if (!subscriptions) await this.client.database.connection.insert({ "id": guild.id, "twitch": [] });

        return subscriptions || { "id": guild.id, "twitch": [] };
    }

    async addSubscription(guild, id) {
        const subscriptions = await this.client.database.connection.table("webhooks").get(id);

        if (!subscriptions) {
            await this.subscribe(id).catch(err => { throw err; });

            return await this.client.database.connection.insert({ id, "guilds": [guild.id] });
        }

        if (subscriptions.guilds.includes(guild.id)) throw "Guild is already subscribed.";

        const newList = subscriptions.guilds;
        newList.push(guild.id);

        return await this.client.database.connection.table("webhooks").get(id).update({ guilds: newList });
    }

    async deleteSubscription(guild, id) {
        const subscriptions = await this.client.database.connection.table("webhooks").get(id);

        if (!subscriptions || !subscriptions.guilds.includes(guild.id)) throw "Guild is not subscribed.";

        const newList = subscriptions.guilds;
        newList.splice(newList.indexOf(guild.id), 1);

        if (!newList.length) {
            await this.unsubscribe(id).catch(err => { throw err; });

            return await this.client.database.connection.delete(id);
        }

        return await this.client.database.connection.table("webhooks").get(id).update({ guilds: newList });
    }
}

module.exports = TwitchWebhookHandler;
