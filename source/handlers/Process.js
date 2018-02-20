class ProcessHandler {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        process.on("message", message => this.message(message));
        process.on("uncaughtException", err => this.log(err.stack, true));
        process.on("unhandledRejection", err => { if (!err) return; this.log(`Uncaught Promise Error:\n${err.stack || JSON.stringify(err)|| err}`, true); });
    }

    async message(message) {
        const { type, data } = message;

        if (type === "stats") {
            this.client.shards = data;
        } else if (type === "reload") {
            this.client.reload(data);
        } else if (type === "transmitTesters") {
            if (this.client.guilds.has("163038706117115906")) this.client.functions.transmitTesters();
        } else if (type === "testers") {
            this.client.testerData = data;
        } else if (type === "message") {
            if (!this.client.channels.has(data.channel)) return;

            const channel = this.client.channels.get(data.channel);
            const options = data.embed ? { embed: data.embed } : {};

            channel.send(data.content, options).catch(err => channel.send(`An error occued while executing an external message.`));
        } else if (type === "globaleval") {
            try { this.client.handlers.process.log(eval(data.code)); }
            catch(err) { this.client.handlers.process.log(err, true); }
        } else if (type === "guildData") {
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
                    channels: guild.channels.map(c => ({ name: c.name, id: c.id, position: c.position, type: c.type })),
                    owner: { username: guildOwner.username, id: guildOwner.id, discriminator: guildOwner.discriminator },
                    settings
                }
            });
        } else if (type === "userData") {
            if (!this.client.users.has(data.user)) return;

            const guild = this.client.guilds.get(data.guild);

            if (!guild) return;

            guild.settings = await this.client.settings.fetch(data.guild);

            const permissions = await this.client.handlers.permissions.fetch(guild, { id: data.user });

            this.client.handlers.process.transmit("masterrequest", {
                id: data.id,
                permissions
            });
        } else if (type === "leaveGuild") {
            if (!this.client.guilds.has(data.guild)) return;

            this.client.guilds.get(data.guild).leave();

            this.client.handlers.process.transmit("masterrequest", {
                id: data.id,
            });
        }
    }

    log(message, error = false) {
        console[error ? "error" : "log"](message);
    }

    transmit(type, data = {}) {
        process.send({ type, data });
    }

    transmitStat(stat) {
        this.transmit("stats", { [stat]: this.client[stat].size });
    }

    transmitStats() {
        this.transmit("stats", {
            guilds: this.client.guilds.size,
            channels: this.client.channels.size,
            voiceConnections: this.client.voiceConnections.size,
            users: this.client.users.size
        });
    }
}

module.exports = ProcessHandler;