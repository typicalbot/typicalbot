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

    async fetchSubscriptions(id) {
        const subscriptions = await this.client.handlers.database.connection.table("webhooks").get(id);

        if (!subscriptions) {
            this.unsubscribe(id);
            return null;
        }

        return subscriptions.guilds;
    }

    async addSubscription(guild, id) {
        const subscriptions = await this.client.handlers.database.connection.table("webhooks").get(id);

        if (!subscriptions) {
            await this.subscribe(id).catch(err => { throw err; });

            return await this.client.handlers.database.connection.table("webhooks").insert({ id, "guilds": [guild.id] });
        }

        if (subscriptions.guilds.includes(guild.id)) throw "Guild is already subscribed.";

        const newList = subscriptions.guilds;
        newList.push(guild.id);

        return await this.client.handlers.database.connection.table("webhooks").get(id).update({ guilds: newList });
    }

    async deleteSubscription(guild, id) {
        const subscriptions = await this.client.handlers.database.connection.table("webhooks").get(id);

        if (!subscriptions || !subscriptions.guilds.includes(guild.id)) throw "Guild is not subscribed.";

        const newList = subscriptions.guilds;
        newList.splice(newList.indexOf(guild.id), 1);

        if (!newList.length) {
            await this.unsubscribe(id).catch(err => { throw err; });

            return await this.client.handlers.database.connection.delete(id);
        }

        return await this.client.handlers.database.connection.table("webhooks").get(id).update({ guilds: newList });
    }

    async handle(data) {
        console.log(data);
        if (!data) return;
        console.log("B");

        const guilds = await this.fetchSubscriptions(data.user_id);
        console.log("C");

        if (!guilds) return;
        console.log("D");

        guilds
            .filter(g => this.client.guilds.has(g))
            .forEach(async g => {
                console.log("E");
                const guild = this.client.guilds.get(g);
                const settings = await guild.fetchSettings();
                console.log("F");

                if (!settings.webhooks.twitch || !settings.webhooks.twitch.id) return;
                console.log("G");

                if (!guild.channels.has(settings.webhooks.twitch.id)) return;
                console.log("H");

                const twitchUser = this.lookup(data.user_id);

                guild.channels.get(settings.webhooks.twitch.id).send(
                    settings.webhooks.twitch.message ?
                        settings.webhooks.twitch.message
                            .replace(/{url}/gi, `https://www.twitch.tv/${twitchUser.login}`)
                            .replace(/{displayname}/gi, twitchUser.display_name)
                            .replace(/{username}/gi, twitchUser.login)
                            .replace(/{description}/gi, twitchUser.description)
                            .replace(/{title}/gi, data.title)
                        :
                        `${twitchUser.display_name} is now live! <https://www.twitch.tv/${twitchUser.login}>`
                );
            });
    }
}

module.exports = TwitchWebhookHandler;
