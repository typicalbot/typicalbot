//const Raven = require("raven");

class ProcessHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        process.on("message", message => this.message(message));
        process.on("uncaughtException", err => this.log(err.stack, true));
        process.on("unhandledRejection", err => {
            if (!err) return;

            this.log(`Uncaught Promise Error:\n${err.stack || JSON.stringify(err) || err}`, true);
            //Raven.captureException(err);
        });
    }

    async message({ event, data }) {
        if (event === "fetchProperty") {
            this.transmit("globalrequest", {
                id: data.id,
                response: eval(`this.client.${data.property}`)
            });
        } else if (event === "twitch_event") {
            //this.client.handlers.webhooks.twitch.handle(data);
        } else if (event === "reload") {
            this.client.reload(data);
        } else if (event === "message") {
            if (!this.client.channels.has(data.channel)) return;

            const channel = this.client.channels.get(data.channel);
            const options = data.embed ? { embed: data.embed } : {};

            channel.send(data.content, options).catch(err => channel.send(`An error occued while executing an external message.`));
        } else if (event === "globaleval") {
            try { this.client.handlers.process.log(eval(data.code)); }
            catch (err) { this.client.handlers.process.log(err, true); }
        } else if (event === "guildData") {
            if (!this.client.guilds.has(data.guild)) return;

            const guild = this.client.guilds.get(data.guild);
            const settings = await this.client.settings.fetch(data.guild);

            const guildOwner = await this.client.users.fetch(guild.ownerID);

            this.client.handlers.process.transmit("masterrequest", {
                id: data.id,
                guild: {
                    name: guild.name,
                    id: guild.id,
                    shard: `${this.client.shardNumber}/${this.client.shardCount} (${this.client.shardID})`,
                    icon: guild.icon,
                    roles: guild.roles.map(r => ({ name: r.name, id: r.id, position: r.position, hoist: r.hoist, permissions: r.permissions, mentionable: r.mentionable })),
                    memberCount: guild.memberCount,
                    channels: guild.channels.map(c => ({ name: c.name, id: c.id, position: c.position, event: c.event })),
                    owner: { username: guildOwner.username, id: guildOwner.id, discriminator: guildOwner.discriminator },
                    settings
                }
            });
        } else if (event === "userData") {
            if (!this.client.users.has(data.user)) return;

            const guild = this.client.guilds.get(data.guild);

            if (!guild) return;

            guild.settings = await this.client.settings.fetch(data.guild);

            const permissions = await this.client.handlers.permissions.fetch(guild, { id: data.user });

            this.client.handlers.process.transmit("masterrequest", {
                id: data.id,
                permissions
            });
        } else if (event === "leaveGuild") {
            if (!this.client.guilds.has(data.guild)) return;

            this.client.guilds.get(data.guild).leave();

            this.client.handlers.process.transmit("masterrequest", {
                id: data.id,
            });
        } else if (event === "embed") {
            const { apiKey, channel, json } = data;

            const guild = Buffer.from(apiKey.split(".")[0], "base64").toString("utf-8");

            if (!this.client.guilds.has(guild)) return;

            const settings = await this.client.settings.fetch(guild);
            const trueApiKey = settings.apikey;

            if (apiKey !== trueApiKey) return this.transmit("masterrequest", {
                id: data.id,
                success: false
            });

            const trueGuild = this.client.guilds.get(guild);

            if (!trueGuild.channels.has(channel)) return this.transmit("masterrequest", {
                id: data.id,
                success: false
            });

            const trueChannel = trueGuild.channels.get(channel);

            trueChannel.send("", json).then(() => {
                this.transmit("masterrequest", {
                    id: data.id,
                    success: true
                });
            }).catch(err => {
                this.transmit("masterrequest", {
                    id: data.id,
                    success: false
                });
            });
        }
    }

    log(message, error = false) {
        console[error ? "error" : "log"](message);
    }

    transmit(event, data = {}) {
        process.send({ event, data });
    }

    fetchShardProperties(property) {
        return new Promise((resolve, reject) => {
            const id = Math.random();

            const listener = ({ event, data }) => {
                if (event !== "returnrequest" || data.id !== id) return;

                process.removeListener("message", listener);
                return resolve(data.response);
            };

            process.on("message", listener);

            process.send({ event: "fetchProperty", data: { property, id } });
        });
    }
}

module.exports = ProcessHandler;